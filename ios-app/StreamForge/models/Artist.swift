//
//  Artist.swift
//  StreamForge
//
//  SwiftData model mirroring backend.
//

import Foundation
import SwiftData

@Model
class Artist {
    var id: String?
    var name: String
    var spotifyId: String?
    // ... other IDs
    @Relationship(deleteRule: .cascade) var songs: [Song] = []

    init(name: String) {
        self.name = name
    }

    static func sample() -> Artist {
        let artist = Artist(name: "Divine Artist")
        artist.songs = [Song(title: "Holy Track")]
        return artist
    }
}

@Model
class Song {
    var title: String
    var platforms: [String: PlatformData] = [:]

    init(title: String) {
        self.title = title
    }
}

@Model
class PlatformData {
    var plays: Int = 0
    var lastBoost: Date?
}