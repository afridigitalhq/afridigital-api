package com.afridigital.afritodo

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

class TaskStorage(context: Context) {

    private val prefs = context.getSharedPreferences("afritodo", Context.MODE_PRIVATE)

    fun save(tasks: List<Task>) {
        val array = JSONArray()

        tasks.forEach { task ->
            array.put(
                JSONObject().apply {
                    put("title", task.title)
                    put("description", task.description)
                    put("priority", task.priority)
                    put("category", task.category)
                    put("due", task.due)
                    put("done", task.done)
                }
            )
        }

        prefs.edit()
            .putString("tasks", array.toString())
            .apply()
    }

    fun load(): MutableList<Task> {
        val tasks = mutableListOf<Task>()
        val raw = prefs.getString("tasks", null) ?: return tasks

        runCatching {
            val array = JSONArray(raw)

            for (i in 0 until array.length()) {
                val item = array.getJSONObject(i)

                tasks.add(
                    Task(
                        title = item.optString("title"),
                        description = item.optString("description"),
                        priority = item.optString("priority", "MEDIUM"),
                        category = item.optString("category", "General"),
                        due = item.optString("due"),
                        done = item.optBoolean("done", false)
                    )
                )
            }
        }

        return tasks
    }
}