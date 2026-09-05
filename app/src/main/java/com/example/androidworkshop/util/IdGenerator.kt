package com.example.androidworkshop.util

import java.security.SecureRandom

object IdGenerator {
    private val CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray()
    private val random = SecureRandom()

    fun generateRegId(): String {
        val part1 = (1..2).map { CHARS[random.nextInt(CHARS.size)] }.joinToString("")
        val num1 = random.nextInt(10).toString()
        val part2 = (1..2).map { CHARS[random.nextInt(CHARS.size)] }.joinToString("")
        val num2 = (10 + random.nextInt(90)).toString()
        return "REG-$part1$num1$part2$num2"
    }
}
