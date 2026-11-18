import * as THREE from 'three';

export interface WebGLProbeResult {
  supported: boolean;
  isSoftwareGl: boolean;
  rendererName: string;
}

let cachedProbe: WebGLProbeResult | null = null;

export function probeWebGLCapabilities(): WebGLProbeResult {
  if (cachedProbe) return cachedProbe;

  if (typeof document === 'undefined') {
    return { supported: false, isSoftwareGl: true, rendererName: 'ssr' };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      (canvas.getContext('webgl') as WebGLRenderingContext | null);

    if (!gl) {
      cachedProbe = { supported: false, isSoftwareGl: true, rendererName: 'none' };
      return cachedProbe;
    }

    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');

    gl.getExtension('WEBGL_lose_context')?.loseContext();

    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    cachedProbe = {
      supported: true,
      isSoftwareGl,
      rendererName: gpu,
    };
    return cachedProbe;
  } catch {
    return { supported: false, isSoftwareGl: true, rendererName: 'error' };
  }
}

export function disposeSceneResources(root: THREE.Object3D): void {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh) {
      obj.geometry?.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat) => {
        if (!mat) return;
        for (const value of Object.values(mat)) {
          if (value instanceof THREE.Texture) {
            value.dispose();
          }
        }
        mat.dispose();
      });
    }
  });
}
