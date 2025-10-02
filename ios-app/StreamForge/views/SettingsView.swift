//
//  SettingsView.swift
//  StreamForge
//
//  Minimal: Auto-run toggle (default on), backend URL (pre-set).
//

import SwiftUI

struct SettingsView: View {
    @AppStorage("autoBoost") private var autoBoost = true
    @State private var backendUrl = "https://your-backend.com"

    var body: some View {
        Form {
            Section("Core") {
                Toggle("Auto-Boost on Launch", isOn: $autoBoost)
                TextField("Backend URL", text: $backendUrl)
                    .disabled(true) // Locked for ease
            }
            Section("AI") {
                Button("Update Evasion Model") {
                    EvasionML.shared.update()
                }
                Text("Last Update: \(Date(), style: .time)")
            }
        }
        .navigationTitle("Settings")
    }
}

#Preview {
    SettingsView()
}
