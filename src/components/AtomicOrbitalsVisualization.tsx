'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { Box, Paper, Text } from '@mantine/core';
import * as THREE from 'three';

interface AtomicOrbitalsProps {
  element: {
    number: number;
    symbol: string;
    electron_shells: number[];
    orbitals: { [key: string]: number };
  };
}

// 原子核組件
function Nucleus({ protons }: { protons: number }) {
  return (
    <group>
      <Sphere args={[0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ff6b6b" />
      </Sphere>
      {/* 暫時移除3D文字以避免字體載入問題 */}
    </group>
  );
}

// 電子軌道組件
function ElectronOrbit({ radius, electrons, shellIndex }: { radius: number; electrons: number; shellIndex: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01 * (shellIndex + 1);
    }
  });

  const electronPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < electrons; i++) {
      const angle = (i / electrons) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      // 加入一些隨機變化使軌道更真實
      const y = (Math.random() - 0.5) * 0.2;
      positions.push([x, y, z]);
    }
    return positions;
  }, [electrons, radius]);

  return (
    <group ref={groupRef}>
      {/* 軌道環 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.01, 8, 32]} />
        <meshBasicMaterial color="#4dabf7" opacity={0.3} transparent />
      </mesh>
      
      {/* 電子 */}
      {electronPositions.map((position, index) => (
        <Sphere key={index} args={[0.05]} position={position as [number, number, number]}>
          <meshStandardMaterial color="#74c0fc" emissive="#1c7ed6" emissiveIntensity={0.3} />
        </Sphere>
      ))}
    </group>
  );
}

// 軌道形狀組件（s, p, d, f軌道的不同形狀）
function OrbitalShape({ type, position }: { type: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getOrbitalGeometry = () => {
    switch (type) {
      case 's':
        return <sphereGeometry args={[0.8, 16, 16]} />;
      case 'p':
        return <sphereGeometry args={[0.6, 8, 16]} />;
      case 'd':
        return <torusGeometry args={[0.7, 0.3, 8, 16]} />;
      case 'f':
        return <octahedronGeometry args={[0.8]} />;
      default:
        return <sphereGeometry args={[0.5, 16, 16]} />;
    }
  };

  const getOrbitalColor = () => {
    switch (type) {
      case 's': return '#ff6b6b';
      case 'p': return '#4dabf7';
      case 'd': return '#69db7c';
      case 'f': return '#ffd43b';
      default: return '#868e96';
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {getOrbitalGeometry()}
      <meshStandardMaterial 
        color={getOrbitalColor()} 
        opacity={0.2} 
        transparent 
        wireframe 
      />
    </mesh>
  );
}

// 主要的3D原子模型組件
function AtomModel({ element }: AtomicOrbitalsProps) {
  const { electron_shells, orbitals, number, symbol } = element;
  
  try {
    return (
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* 原子核 */}
        <Nucleus protons={number} />
        
        {/* 電子軌道 */}
        {electron_shells && electron_shells.map((electronCount, index) => (
          <ElectronOrbit 
            key={index} 
            radius={1 + index * 0.8} 
            electrons={electronCount} 
            shellIndex={index}
          />
        ))}
        
        {/* 軌道形狀可視化 */}
        {Object.entries(orbitals || {}).map(([orbitalType, count], index) => {
          if (!orbitalType || orbitalType === 'simplified' || !count || count <= 0) return null;
          const orbitalTypeChar = orbitalType.slice(-1); // 獲取 s, p, d, f
          // 確保軌道類型有效
          if (!['s', 'p', 'd', 'f'].includes(orbitalTypeChar)) return null;
          return (
            <OrbitalShape 
              key={orbitalType} 
              type={orbitalTypeChar} 
              position={[index * 2 - 2, 2, 0]} 
            />
          );
        })}
        
        {/* 控制器 */}
        <OrbitControls enableZoom enablePan enableRotate />
      </Canvas>
    );
  } catch (error) {
    console.error('AtomModel 渲染錯誤:', error);
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px'
      }}>
        <Text c="dimmed">無法載入3D模型</Text>
      </div>
    );
  }
}

export default function AtomicOrbitalsVisualization({ element }: AtomicOrbitalsProps) {
  // 添加安全檢查
  if (!element || !element.electron_shells || !element.orbitals) {
    return (
      <Paper withBorder p="md" h={400}>
        <Text size="lg" fw={600} mb="sm">
          載入中...
        </Text>
        <Box h={300} style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
          <Text ta="center" pt="xl">載入元素數據中</Text>
        </Box>
      </Paper>
    );
  }
  return (
    <Paper withBorder p="md" h={400}>
      <Text size="lg" fw={600} mb="sm">
        {element.symbol} - 3D原子軌道模型
      </Text>
      <Box h={300} style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
        <AtomModel element={element} />
      </Box>
      <Text size="xs" c="dimmed" mt="xs">
        拖動滑鼠旋轉視角，滾輪縮放，右鍵平移
      </Text>
    </Paper>
  );
}