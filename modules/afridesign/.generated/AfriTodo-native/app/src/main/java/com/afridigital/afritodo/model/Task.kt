package com.afridigital.afritodo

data class Task(
        var title: String,
        var description: String = "",
        var priority: String = "MEDIUM",
        var category: String = "General",
        var due: String = "",
        var done: Boolean = false
    )