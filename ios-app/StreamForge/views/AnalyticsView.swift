//
//  AnalyticsView.swift
//  StreamForge
//
//  Real-time graphs, trends from AI.
//

import SwiftUI
import Charts

struct AnalyticsView: View {
    @State private var trends: [Trend] = []

    var body: some View {
        VStack {
            Chart(trends) { trend in
                LineMark(
                    x: .value("Time", trend.timestamp),
                    y: .value("Success Rate", trend.successRate)
                )
            }
            .frame(height: 200)

            List(trends, id: \.id) { trend in
                HStack {
                    Text(trend.platform)
                    Spacer()
                    Text("\(trend.successRate, specifier: "%.1f")%")
                }
            }
        }
        .navigationTitle("Analytics")
        .task {
            trends = await TrendAnalyzer.shared.fetchTrends()
        }
    }
}

struct Trend: Identifiable {
    let id = UUID()
    let platform: String
    let timestamp: Date
    let successRate: Double
}

#Preview {
    AnalyticsView()
}