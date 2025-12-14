"use client";

import React, { useState } from "react";
import { Engine, Scene } from "react-babylonjs";
import { Vector3, Texture, BaseTexture } from "@babylonjs/core";

export default function Home() {
    const [hdrTexture, setHdrTexture] = useState<BaseTexture | null>(null);

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Engine antialias adaptToDeviceRatio canvasId="babylon-canvas">
                <Scene>
                    {/* HDR Texture (fully declarative) */}
                    <hdrCubeTexture
                        name="hdrTex"
                        url="https://playground.babylonjs.com/textures/room.hdr"
                        size={512}
                        gammaSpace={false}
                        assignTo="environmentTexture"
                        onCreated={(texture) => setHdrTexture(texture)}
                    />

                    {/* Render only when HDR is created */}
                    {hdrTexture && (
                        <>
                            {/* Declarative Environment + Skybox */}
                            <environmentHelper
                                options={{
                                    createSkybox: true,
                                    skyboxTexture: hdrTexture,
                                    skyboxSize: 1000,
                                    createGround: false, // <-- remove purple floor
                                }}
                            />

                            {/* Camera */}
                            <arcRotateCamera
                                name="camera"
                                alpha={Math.PI / 3}
                                beta={Math.PI / 3}
                                radius={4}
                                target={Vector3.Zero()}
                                wheelPrecision={50}
                                panningSensibility={0}
                            />

                            {/* Light */}
                            <hemisphericLight
                                name="light"
                                direction={Vector3.Up()}
                                intensity={1}
                            />

                            {/* Sphere with reflections */}
                            <sphere name="sphere" diameter={1} segments={32}>
                                <pbrMaterial
                                    name="mat"
                                    metallic={1}
                                    roughness={0}
                                    environmentIntensity={1}
                                    albedoTexture={
                                        new Texture(
                                            "https://playground.babylonjs.com/textures/grass.png"
                                        )
                                    }
                                />
                            </sphere>
                        </>
                    )}
                </Scene>
            </Engine>
        </div>
    );
}
