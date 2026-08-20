export default function taskPartial({ packageName }) {
  return "package " + packageName + "\n\n" + "data class Task(\n        var title: String,\n        var description: String = \"\",\n        var priority: String = \"MEDIUM\",\n        var category: String = \"General\",\n        var due: String = \"\",\n        var done: Boolean = false\n    )";
}
