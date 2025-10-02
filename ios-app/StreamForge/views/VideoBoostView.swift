//
//  VideoBoostView.swift
//  StreamForge
//
//  YouTube-specific tab: Video URL input, boost button.
//

import SwiftUI

struct VideoBoostView: View {
    @State private var videoUrl = ""
    @State private var isBoosting = false

    var body: some View {
        VStack {
            TextField("YouTube Video URL", text: $videoUrl)
                .textFieldStyle(.roundedBorder)
                .padding()

            GlassButton(title: "Boost Video Streams", systemImage: "play.circle") {
                Task {
                    isBoosting = true
                    try? await APIService.shared.boostVideo(url: videoUrl)
                    isBoosting = false
                }
            }
            .disabled(isBoosting || videoUrl.isEmpty)

            if isBoosting {
                ProgressView("Playing divine loops...")
            }

            Spacer()
        }
        .navigationTitle("Video Boost")
        .background(GlassBackground())
    }
}

struct GlassBackground: View {
    var body: some View {
        LinearGradient(gradient: Gradient(colors: [.clear, .blue.opacity(0.1)]), startPoint: .top, endPoint: .bottom)
            .ignoresSafeArea()
    }
}

#Preview {
    VideoBoostView()
}