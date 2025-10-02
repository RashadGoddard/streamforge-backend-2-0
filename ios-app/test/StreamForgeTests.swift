//
//  StreamForgeTests.swift
//  StreamForgeTests
//

import XCTest
@testable import StreamForge

final class StreamForgeTests: XCTestCase {
    func testAPIServiceBoost() async {
        let service = APIService.shared
        do {
            let result = try await service.initiateBoost(artistId: "mock", song: "test", platforms: ["spotify"])
            XCTAssert(result.count > 0)
        } catch {
            XCTFail("Boost failed: \(error)")
        }
    }

    func testRevenueEstimate() async {
        let estimate = await APIService.shared.estimateRevenue(for: "mock", song: "test")
        XCTAssertNotNil(estimate)
    }

    // More: UI tests with XCUITest for taps, etc.
}