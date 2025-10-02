//
//  StreamData.swift
//  StreamForge
//
//  For API responses.
//

import Foundation

struct StreamResponse: Codable {
    let success: Bool
    let platform: String
    let playCount: Int
}

struct RevenueEstimate: Codable {
    let totalStreams: Int
    let estimatedRevenue: [String: String]
    let totalRevenue: String
    let advice: String
}