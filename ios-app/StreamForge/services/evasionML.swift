//
//  EvasionML.swift
//  StreamForge
//
//  Core ML integration for ploy selection.
//

import CoreML
import Foundation

class EvasionML: ObservableObject {
    static let shared = EvasionML()
    private var model: MLModel?

    func loadModel() {
        // Assume EvasionPloy.mlmodelc in bundle (trained on human play data)
        guard let modelUrl = Bundle.main.url(forResource: "EvasionPloy", withExtension: "mlmodelc"),
              let model = try? MLModel(contentsOf: modelUrl) else {
            print("Model load failed—fallback to random.")
            return
        }
        self.model = model
    }

    func selectPloy(for platform: String) -> String {
        // Run inference: input platform, output ploy prob
        // Mock for now
        let ploys = ["pause", "jump", "spoof"]
        return ploys.randomElement() ?? "pause"
    }

    func update() {
        // OTA download new model from backend
        // URLSession download to app docs, reload
    }
}