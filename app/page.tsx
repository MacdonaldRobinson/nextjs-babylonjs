"use client";

import React from "react";
import { Engine, Scene } from "react-babylonjs";
import * as BABYLON from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export default function Home() {
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Engine antialias adaptToDeviceRatio canvasId="babylon-canvas">
                <Scene
                    onSceneMount={({ scene }) => {
                        if (!scene) return;

                        // ✅ HDR environment
                        const hdrTexture = new BABYLON.HDRCubeTexture(
                            "https://playground.babylonjs.com/textures/room.hdr",
                            scene,
                            512,
                            false,
                            true,
                            false,
                            true
                        );
                        scene.environmentTexture = hdrTexture;

                        // ✅ Skybox so HDR is visible
                        scene.createDefaultSkybox(hdrTexture, true, 1000);

                        // ✅ Lights
                        const hemi = new BABYLON.HemisphericLight(
                            "hemi",
                            new Vector3(0, 1, 0),
                            scene
                        );
                        hemi.intensity = 1;

                        const dir = new BABYLON.DirectionalLight(
                            "dir",
                            new Vector3(-1, -2, -1),
                            scene
                        );
                        dir.intensity = 1;

                        // ✅ PBR material with texture and HDR reflections
                        const mat = new BABYLON.PBRMaterial("pbrMat", scene);
                        mat.metallic = 1;
                        mat.roughness = 0;
                        mat.backFaceCulling = false;
                        mat.albedoTexture = new BABYLON.Texture(
                            "https://via.assets.so/game.png?id=1&q=95&w=360&h=360&fit=fill",
                            scene
                        );
                        mat.environmentIntensity = 1; // HDR reflections visible

                        // ✅ Cube mesh
                        const box = BABYLON.MeshBuilder.CreateSphere(
                            "box",
                            {},
                            scene
                        );
                        box.material = mat;
                        box.position = Vector3.Zero();

                        // ✅ Rotate cube
                        scene.onBeforeRenderObservable.add(() => {
                            //box.rotation.y += 0.01;
                        });

                        // ✅ Camera
                        const camera = new BABYLON.ArcRotateCamera(
                            "camera",
                            Math.PI / 2,
                            Math.PI / 2,
                            3,
                            Vector3.Zero(),
                            scene
                        );
                        camera.attachControl(
                            scene.getEngine().getRenderingCanvas(),
                            true
                        );
                        camera.lowerBetaLimit = 0;
                        camera.upperBetaLimit = Math.PI;
                        camera.lowerRadiusLimit = 1;
                        camera.upperRadiusLimit = camera.radius + 5;
                        camera.wheelPrecision = 50;
                        camera.panningSensibility = 0;
                        camera.minZ = 0.1; // smaller = can get closer without disappearing
                        camera.maxZ = 1000; // optional, far clipping
                    }}
                >
                    {/* Empty children fixes TypeScript */}
                    <> </>
                </Scene>
            </Engine>
        </div>
    );
}
