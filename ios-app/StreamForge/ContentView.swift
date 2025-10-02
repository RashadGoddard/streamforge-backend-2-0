//
//  ContentView.swift
//  StreamForge
//
//  Main TabView mimicking iOS stock apps—glass tabs, SF Symbols.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Image(systemName: "chart.bar.fill")
                    Text("Dashboard")
                }
            BoostView()
                .tabItem {
                    Image(systemName: "flame.fill")
                    Text("Boost")
                }
            VideoBoostView()
                .tabItem {
                    Image(systemName: "play.rectangle.fill")
                    Text("Videos")
                }
            AnalyticsView()
                .tabItem {
                    Image(systemName: "magnifyingglass")
                    Text("Analytics")
                }
            SettingsView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("Settings")
                }
        }
        .tint(.blue) // Apple blue
        .background(GlassBackground()) // iOS 26 glass effect
        .onAppear {
            APIService.shared.setup() // Auto-connect backend
            EvasionML.shared.loadModel() // Init AI core
            TrendAnalyzer.shared.startUpdates() // Real-time trends
        }
    }
}

#Preview {
    ContentView()
}