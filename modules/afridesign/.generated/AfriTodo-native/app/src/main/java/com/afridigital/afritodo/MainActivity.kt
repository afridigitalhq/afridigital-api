package com.afridigital.afritodo

import android.app.Activity
import android.app.AlertDialog
import android.os.Bundle
import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.view.Gravity
import android.view.ViewGroup
import android.widget.*
import android.text.TextWatcher
import android.text.Editable
import org.json.JSONObject

class MainActivity : Activity() {

    private lateinit var taskContainer: LinearLayout
    private lateinit var taskStorage: TaskStorage
    private lateinit var searchInput: EditText
    private val tasks = mutableListOf<Task>()
    private var filter = "ALL"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        taskStorage = TaskStorage(this)
        tasks.addAll(taskStorage.load())
        buildUi()
        renderTasks()
    }

    private fun buildUi() {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(28, 36, 28, 24)
            setBackgroundColor(Color.rgb(246, 248, 252))
        }

        val header = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }

        val title = TextView(this).apply {
            text = "AfriTodo"
            textSize = 30f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.rgb(25, 45, 80))
        }

        header.addView(
            title,
            LinearLayout.LayoutParams(
                0,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                1f
            )
        )

        val add = Button(this).apply {
            text = "+ Add Task"
            setOnClickListener {
                showTaskDialog(null, -1)
            }
        }

        header.addView(add)
        root.addView(header)

        val summary = TextView(this).apply {
            text = "Plan it. Track it. Finish it."
            textSize = 15f
            setTextColor(Color.DKGRAY)
            setPadding(0, 8, 0, 18)
        }

        root.addView(summary)

        searchInput = EditText(this).apply {
            hint = "Search tasks..."
            setSingleLine(true)
        }

        root.addView(
            searchInput,
            LinearLayout.LayoutParams(
                -1,
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
        )

        searchInput.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(
                s: CharSequence?,
                start: Int,
                count: Int,
                after: Int
            ) {}

            override fun onTextChanged(
                s: CharSequence?,
                start: Int,
                before: Int,
                count: Int
            ) {
                renderTasks()
            }

            override fun afterTextChanged(s: Editable?) {}
        })

        val filters = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(0, 14, 0, 14)
        }

        listOf("ALL", "ACTIVE", "DONE").forEach { value ->
            val button = Button(this).apply {
                text = value
                setOnClickListener {
                    filter = value
                    renderTasks()
                }
            }

            filters.addView(
                button,
                LinearLayout.LayoutParams(
                    0,
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    1f
                )
            )
        }

        root.addView(filters)

        taskContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }

        val scroll = ScrollView(this).apply {
            addView(taskContainer)
        }

        root.addView(
            scroll,
            LinearLayout.LayoutParams(
                -1,
                0,
                1f
            )
        )

        setContentView(root)
    }

    private fun renderTasks() {
        taskContainer.removeAllViews()

        val query = if (::searchInput.isInitialized) {
            searchInput.text.toString().trim().lowercase()
        } else {
            ""
        }

        val visible = tasks.filter { task ->
            (
                filter == "ALL" ||
                (filter == "ACTIVE" && !task.done) ||
                (filter == "DONE" && task.done)
            ) &&
            (
                query.isEmpty() ||
                task.title.lowercase().contains(query) ||
                task.category.lowercase().contains(query)
            )
        }

        if (visible.isEmpty()) {
            taskContainer.addView(
                TextView(this).apply {
                    text = if (tasks.isEmpty()) {
                        "No tasks yet.\\nTap + Add Task to get started."
                    } else {
                        "No tasks match this view."
                    }
                    textSize = 18f
                    gravity = Gravity.CENTER
                    setPadding(24, 60, 24, 60)
                }
            )
            return
        }

        visible.forEach { task ->
            val index = tasks.indexOf(task)

            val card = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(22, 18, 22, 18)
                setBackgroundColor(Color.WHITE)
            }

            val row = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
            }

            val check = CheckBox(this).apply {
                isChecked = task.done
                setOnCheckedChangeListener { _, checked ->
                    task.done = checked
                    taskStorage.save(tasks)
                    renderTasks()
                }
            }

            row.addView(check)

            val taskText = TextView(this).apply {
                text = task.title
                textSize = 18f
                typeface = Typeface.DEFAULT_BOLD
                if (task.done) {
                    paintFlags = paintFlags or 16
                }
            }

            row.addView(
                taskText,
                LinearLayout.LayoutParams(
                    0,
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    1f
                )
            )

            val edit = Button(this).apply {
                text = "Edit"
                setOnClickListener {
                    showTaskDialog(task, index)
                }
            }

            row.addView(edit)
            card.addView(row)

            val meta = TextView(this).apply {
                text = "\${task.category}  •  \${task.priority}" +
                    if (task.due.isNotEmpty()) {
                        "  •  \${task.due}"
                    } else {
                        ""
                    }
                textSize = 13f
                setTextColor(Color.GRAY)
                setPadding(48, 0, 0, 0)
            }

            card.addView(meta)

            if (task.description.isNotEmpty()) {
                card.addView(
                    TextView(this).apply {
                        text = task.description
                        textSize = 14f
                        setPadding(48, 8, 0, 0)
                    }
                )
            }

            taskContainer.addView(
                card,
                LinearLayout.LayoutParams(
                    -1,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 0, 0, 14)
                }
            )
        }
    }

    private fun showTaskDialog(task: Task?, index: Int) {
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(32, 8, 32, 0)
        }

        val title = EditText(this).apply {
            hint = "Task title"
            setText(task?.title ?: "")
        }

        val description = EditText(this).apply {
            hint = "Description"
            setText(task?.description ?: "")
        }

        val priority = Spinner(this).apply {
            adapter = ArrayAdapter(
                this@MainActivity,
                android.R.layout.simple_spinner_dropdown_item,
                arrayOf("LOW", "MEDIUM", "HIGH")
            )

            setSelection(
                arrayOf("LOW", "MEDIUM", "HIGH")
                    .indexOf(task?.priority ?: "MEDIUM")
            )
        }

        val category = EditText(this).apply {
            hint = "Category"
            setText(task?.category ?: "General")
        }

        val due = EditText(this).apply {
            hint = "Due date (e.g. 20 Aug)"
            setText(task?.due ?: "")
        }

        box.addView(title)
        box.addView(description)
        box.addView(priority)
        box.addView(category)
        box.addView(due)

        val dialog = AlertDialog.Builder(this)
            .setTitle(if (task == null) "Add Task" else "Edit Task")
            .setView(box)
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Save") { _, _ ->
                val cleanTitle = title.text.toString().trim()

                if (cleanTitle.isNotEmpty()) {
                    val value = Task(
                        title = cleanTitle,
                        description = description.text.toString().trim(),
                        priority = priority.selectedItem.toString(),
                        category = category.text.toString()
                            .trim()
                            .ifEmpty { "General" },
                        due = due.text.toString().trim(),
                        done = task?.done ?: false
                    )

                    if (index >= 0) {
                        tasks[index] = value
                    } else {
                        tasks.add(value)
                    }

                    taskStorage.save(tasks)
                    renderTasks()
                }
            }

        if (task != null) {
            dialog.setNeutralButton("Delete") { _, _ ->
                tasks.removeAt(index)
                taskStorage.save(tasks)
                renderTasks()
            }
        }

        dialog.show()
    }

}