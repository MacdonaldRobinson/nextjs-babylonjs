"use client";

import React, { useState } from "react";
import { Engine, Scene } from "react-babylonjs";
import * as BABYLON from "@babylonjs/core";
import { Vector3, Texture } from "@babylonjs/core";

export default function Home() {
    const [hdrReflection, setHdrReflection] =
        useState<BABYLON.HDRCubeTexture | null>(null);
    const [hdrSkybox, setHdrSkybox] = useState<BABYLON.HDRCubeTexture | null>(
        null
    );

    const hdrUrl = "https://playground.babylonjs.com/textures/room.hdr";

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Engine antialias adaptToDeviceRatio canvasId="babylon-canvas">
                <Scene>
                    {/* HDR for sphere reflections */}
                    <hdrCubeTexture
                        url={hdrUrl}
                        size={512}
                        gammaSpace={false}
                        coordinatesMode={BABYLON.Texture.CUBIC_MODE}
                        assignTo="environmentTexture"
                        onCreated={(tex) => {
                            setHdrReflection(tex);
                        }}
                    />

                    {/* HDR for skybox */}
                    <hdrCubeTexture
                        url={hdrUrl}
                        size={512}
                        gammaSpace={false}
                        coordinatesMode={BABYLON.Texture.SKYBOX_MODE}
                        onCreated={(tex) => {
                            tex.level = 5;
                            setHdrSkybox(tex);
                        }}
                    />

                    {/* Render everything only when both HDRs are ready */}
                    {hdrReflection && hdrSkybox && (
                        <>
                            {/* Skybox declarative */}
                            <environmentHelper
                                options={{
                                    createSkybox: true,
                                    skyboxTexture: hdrSkybox,
                                    skyboxSize: 1000,
                                    createGround: false, // remove purple floor
                                }}
                            />

                            {/* Camera */}
                            <arcRotateCamera
                                name="camera"
                                alpha={Math.PI / 3}
                                beta={Math.PI / 3}
                                radius={4}
                                target={Vector3.Zero()}
                                wheelPrecision={100}
                                wheelDeltaPercentage={0.01} // smooth zoom
                                lowerRadiusLimit={1} // min zoom
                                upperRadiusLimit={6} // max zoom
                                panningSensibility={0} // disable panning
                                minZ={0.1}
                            />

                            {/* Light */}
                            <hemisphericLight
                                name="hemiLight"
                                direction={Vector3.Up()}
                                intensity={10}
                            />

                            {/* Sphere with reflections */}
                            <sphere
                                name="sphere"
                                diameter={1}
                                segments={32}
                                position={Vector3.Zero()}
                                rotation={Vector3.FromArray([0, 0, 0])}
                            >
                                <pbrMaterial
                                    name="pbrMat"
                                    metallic={1}
                                    roughness={0}
                                    environmentIntensity={5} // HDR reflection brightness
                                    albedoTexture={
                                        new Texture(
                                            "https://via.assets.so/game.png?id=5&q=95&w=360&h=360&fit=fill"
                                        )
                                    }
                                    reflectionTexture={hdrReflection}
                                />
                            </sphere>
                        </>
                    )}
                </Scene>
            </Engine>
        </div>
    );
}
