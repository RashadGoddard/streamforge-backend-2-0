//
//  DashboardView.swift
//  StreamForge
//
//  Summary section: All-time streams per platform, revenue estimator.
//

import SwiftUI
import Charts // iOS 18+ Charts for graphs

struct DashboardView: View {
    @State private var summary: [String: Int] = [:]
    @State private var revenueEstimate: RevenueEstimate?
    @State private var selectedArtist: Artist?

    var body: some View {
        NavigationStack {
            VStack {
                if let estimate = revenueEstimate {
                    VStack(alignment: .leading) {
                        Text("Estimated Revenue: $\(estimate.totalRevenue, specifier: "%.2f")")
                            .font(.largeTitle.bold())
                            .foregroundStyle(.white)
                        Text("Total Streams Boasted: \(estimate.totalStreams.formatted())")
                            .font(.title2)
                        Text("AI Tip: \(estimate.advice)")
                            .font(.body)
                            .italic()
                    }
                    .padding()
                    .background(GlassCard())
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                }

                // All-time boasts chart
                if !summary.isEmpty {
                    Chart {
                        ForEach(summary.sorted(by: { $0.value > $1.value }), id: \.key) { plat, count in
                            BarMark(
                                x: .value("Platform", plat),
                                y: .value("Streams", count)
                            )
                            .foregroundStyle(by: .value("Platform", plat))
                        }
                    }
                    .frame(height: 300)
                    .chartYAxis {
                        AxisMarks(position: .leading)
                    }
                    .padding()
                    .background(GlassCard())
                }

                Spacer()
            }
            .navigationTitle("Divine Dashboard")
            .task {
                await loadSummary()
                if let artist = selectedArtist {
                    revenueEstimate = await APIService.shared.estimateRevenue(for: artist.id, song: artist.songs.first?.title ?? "")
                }
            }
        }
    }

    private func loadSummary() {
        // Fetch from backend
        Task {
            do {
                let data = try await APIService.shared.fetchSummary(for: selectedArtist?.id ?? "")
                await MainActor.run {
                    summary = data.summary
                }
            } catch {
                // Handle error with alert
            }
        }
    }
}

struct GlassCard: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(.ultraThinMaterial) // iOS 26 glassmorphism
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .shadow(color: .black.opacity(0.1), radius: 10)
    }
}

extension View {
    func glassCard() -> some View {
        modifier(GlassCard())
    }
}

#Preview {
    DashboardView()
}