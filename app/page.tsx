"use client";

import React, { useState } from "react";
import { Engine, Scene } from "react-babylonjs";
import * as BABYLON from "@babylonjs/core";
import { Vector3, Texture } from "@babylonjs/core";

export default function Home() {
    const hdrUrl = "https://playground.babylonjs.com/textures/room.hdr";
    const [hdrs, setHdrs] = useState<{
        reflection?: BABYLON.HDRCubeTexture;
        skybox?: BABYLON.HDRCubeTexture;
    }>({});

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Engine antialias adaptToDeviceRatio canvasId="babylon-canvas">
                <Scene>
                    {/* Load HDR once for reflections and skybox */}
                    <hdrCubeTexture
                        url={hdrUrl}
                        size={512}
                        gammaSpace={false}
                        coordinatesMode={BABYLON.Texture.CUBIC_MODE}
                        assignTo="environmentTexture"
                        onCreated={(tex) => {
                            tex.level = 1;
                            // Clone for skybox
                            const skyboxTex = tex.clone();
                            skyboxTex.level = 5;
                            skyboxTex.coordinatesMode =
                                BABYLON.Texture.SKYBOX_MODE;
                            setHdrs({ reflection: tex, skybox: skyboxTex });
                        }}
                    />

                    {/* Only render when HDRs are ready */}
                    {hdrs.reflection && hdrs.skybox && (
                        <>
                            <environmentHelper
                                options={{
                                    createSkybox: true,
                                    skyboxTexture: hdrs.skybox,
                                    skyboxSize: 1000,
                                    createGround: false,
                                }}
                            />

                            <arcRotateCamera
                                name="camera"
                                alpha={Math.PI / 3}
                                beta={Math.PI / 3}
                                radius={4}
                                target={Vector3.Zero()}
                                wheelPrecision={100}
                                wheelDeltaPercentage={0.01}
                                lowerRadiusLimit={1}
                                upperRadiusLimit={6}
                                panningSensibility={0}
                                minZ={0.1}
                            />

                            <hemisphericLight
                                name="hemiLight"
                                direction={Vector3.Up()}
                                intensity={10}
                            />

                            <sphere
                                name="sphere"
                                diameter={1}
                                segments={32}
                                position={Vector3.Zero()}
                            >
                                <pbrMaterial
                                    name="pbrMat"
                                    metallic={1}
                                    roughness={0}
                                    environmentIntensity={5}
                                    albedoTexture={
                                        new Texture(
                                            "https://via.assets.so/game.png?id=5&q=95&w=360&h=360&fit=fill"
                                        )
                                    }
                                    reflectionTexture={hdrs.reflection}
                                />
                            </sphere>
                        </>
                    )}
                </Scene>
            </Engine>
        </div>
    );
}
