export class PingPongField {
  constructor(gl, size = 256) {
    this.gl = gl;
    this.size = size;

    this.state = {
      read: this.createTexture(),
      write: this.createTexture()
    };

    this.fbo = {
      read: this.createFBO(this.state.read),
      write: this.createFBO(this.state.write)
    };
  }

  createTexture() {
    const gl = this.gl;
    const tex = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.size,
      this.size,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return tex;
  }

  createFBO(tex) {
    const gl = this.gl;
    const fbo = gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0
    );

    return fbo;
  }

  swap() {
    const tmp = this.state.read;
    this.state.read = this.state.write;
    this.state.write = tmp;

    const tmpFbo = this.fbo.read;
    this.fbo.read = this.fbo.write;
    this.fbo.write = tmpFbo;
  }
}
