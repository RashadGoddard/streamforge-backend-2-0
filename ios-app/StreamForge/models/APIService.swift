//
//  APIService.swift
//  StreamForge
//
//  Backend comms with auth, encryption.
//

import Foundation

class APIService: ObservableObject {
    static let shared = APIService()
    private let baseUrl = "http://localhost:3000/api" // Or env
    private var token: String?

    func setup() {
        // Fetch token from Keychain or auto-register
        token = UserDefaults.standard.string(forKey: "jwtToken") ?? autoLogin()
    }

    private func autoLogin() -> String? {
        // Minimal user: auto-create guest
        // POST to /auth/register with guest creds, store token
        return "mock_token" // Real: URLSession
    }

    func initiateBoost(artistId: String, song: String, platforms: [String]) async throws -> [StreamResponse] {
        let url = URL(string: "\(baseUrl)/streams/boost")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token ?? "")", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["artistId": artistId, "songTitle": song, "platforms": platforms]
        request.httpBody = try JSONEncoder().encode(body)

        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode([StreamResponse].self, from: data)
    }

    func fetchSummary(for artistId: String) async throws -> SummaryResponse {
        let url = URL(string: "\(baseUrl)/analytics/summary/\(artistId)")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token ?? "")", forHTTPHeaderField: "Authorization")

        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(SummaryResponse.self, from: data)
    }

    func estimateRevenue(for artistId: String, song: String?) async -> RevenueEstimate? {
        let url = URL(string: "\(baseUrl)/analytics/estimate")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token ?? "")", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["artistId": artistId, "songTitle": song ?? ""]
        request.httpBody = try? JSONEncoder().encode(body)

        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            return try JSONDecoder().decode(RevenueEstimate.self, from: data)
        } catch {
            print("Estimate failed: \(error)")
            return nil
        }
    }

    func boostVideo(url: String) async throws {
        // Similar to boost, but for youtubeVideo platform
        // Extract ID from URL, call API
    }
}

struct SummaryResponse: Codable {
    let summary: [String: Int]
    let totalStreams: Int
}