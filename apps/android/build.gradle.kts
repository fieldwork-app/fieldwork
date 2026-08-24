buildscript {
    dependencies {
        // AGP 9 provides built-in Kotlin. Pin the newer compiler used by the
        // Compose compiler plugin instead of applying kotlin-android separately.
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:2.3.20")
    }
}

plugins {
    id("com.android.application") version "9.0.1" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.3.20" apply false
    id("com.google.gms.google-services") version "4.4.4" apply false
}
