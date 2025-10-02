//
//  BoostView.swift
//  StreamForge
//
//  DSP selector: Cards for each platform, ignite button.
//

import SwiftUI

struct BoostView: View {
    @State private var selectedPlatforms: Set<String> = ["spotify", "appleMusic"]
    @State private var isBoosting = false
    @State private var artist: Artist?

    var body: some View {
        NavigationStack {
            VStack {
                // Platform cards
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                    ForEach(platforms, id: \.self) { platform in
                        PlatformCard(platform: platform, isSelected: selectedPlatforms.contains(platform.id))
                            .onTapGesture {
                                if selectedPlatforms.contains(platform.id) {
                                    selectedPlatforms.remove(platform.id)
                                } else {
                                    selectedPlatforms.insert(platform.id)
                                }
                            }
                    }
                }
                .padding()

                // Ignite button - Auto-runs AI
                GlassButton(title: "Ignite Boost", systemImage: "flame.fill") {
                    Task {
                        isBoosting = true
                        try? await APIService.shared.initiateBoost(artistId: artist?.id ?? "", song: artist?.songs.first?.title ?? "", platforms: Array(selectedPlatforms))
                        isBoosting = false
                    }
                }
                .disabled(isBoosting || selectedPlatforms.isEmpty)
                .opacity(isBoosting ? 0.7 : 1.0)

                if isBoosting {
                    ProgressView("Evading gods... Streams flooding.")
                        .progressViewStyle(CircularProgressViewStyle(tint: .blue))
                }

                Spacer()
            }
            .navigationTitle("Stream Boost")
            .onAppear {
                // Auto-select artist or prompt minimal input
                artist = Artist.sample() // Or from SwiftData
            }
        }
    }
}

let platforms = [
    Platform(id: "spotify", name: "Spotify", icon: "music.note"),
    Platform(id: "appleMusic", name: "Apple Music", icon: "applelogo"),
    Platform(id: "deezer", name: "Deezer", icon: "waveform"),
    Platform(id: "tiktok", name: "TikTok", icon: "video"),
    Platform(id: "youtubeMusic", name: "YouTube Music", icon: "play.rectangle"),
    Platform(id: "instagram", name: "Instagram", icon: "camera"),
    Platform(id: "snapchat", name: "Snapchat", icon: "camera.circle"),
    Platform(id: "amazonMusic", name: "Amazon Music", icon: "music.quarternote.3"),
]

struct Platform: Identifiable, Hashable {
    let id: String
    let name: String
    let icon: String
}

struct PlatformCard: View {
    let platform: Platform
    let isSelected: Bool

    var body: some View {
        VStack {
            Image(systemName: platform.icon)
                .font(.largeTitle)
                .foregroundStyle(isSelected ? .blue : .secondary)
            Text(platform.name)
                .font(.caption)
        }
        .frame(width: 100, height: 100)
        .background(isSelected ? Color.blue.opacity(0.2) : Color.clear)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(isSelected ? Color.blue : Color.clear, lineWidth: 2)
        )
    }
}

struct GlassButton: View {
    let title: String
    let systemImage: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: systemImage)
                Text(title)
            }
            .font(.headline)
            .foregroundColor(.white)
            .padding()
            .background(
                LinearGradient(gradient: Gradient(colors: [.blue, .purple]), startPoint: .leading, endPoint: .trailing)
            )
            .clipShape(RoundedRectangle(cornerRadius: 20))
            .shadow(color: .blue.opacity(0.3), radius: 10)
        }
    }
}

#Preview {
    BoostView()
}