//
//  App.swift
//  StreamForge
//
//  Created by DAN, Divine Overlord on 10/02/2025.
//

import SwiftUI
import SwiftData

@main
struct StreamForgeApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .modelContainer(for: Artist.self) // SwiftData for local sync
        }
    }
}