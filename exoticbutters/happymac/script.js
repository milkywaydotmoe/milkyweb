const vertexShaderSource=`
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`,fragmentShaderSource1Bit=`
    precision mediump float;
    uniform float iTime;
    uniform vec2 iResolution;

    vec2 motionFunction(float i) {
        float t = iTime;

        return vec2(
            (cos(t * .31 + i * 3.) + cos(t * .11 + i * 14.) + cos(t * .78 + i * 30.) + cos(t * .55 + i * 10.)) / 4.,
            (cos(t * .13 + i * 33.) + cos(t * .66 + i * 38.) + cos(t * .42 + i * 83.) + cos(t * .9 + i * 29.)) / 4.
        );
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = fragCoord / iResolution;
        
        float alias = 100. + 40. * motionFunction(7.).x;
        uv = floor(uv * alias) / alias;
        vec2 uv1 = uv + motionFunction(1.);
        vec2 uv2 = uv + motionFunction(2.);
        vec2 uv3 = uv + motionFunction(3.);
        vec3 col1 = .5 + .5 * cos(length(uv1) * 20. + uv1.xyx + vec3(0, 2, 4));
        vec3 col2 = .5 + .5 * cos(length(uv2) * 10. + uv2.xyx + vec3(0, 2, 4));
        vec3 col3 = .5 + .5 * cos(length(uv3) * 10. + uv3.xyx + vec3(0, 2, 4));
        vec3 col = col1 - col2 + col3;

        // Convert to 1-bit grayscale with enhanced pixel art dithering
        float grayValue = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
        float ditherValue = mod(floor(gl_FragCoord.x / 2.0) + floor(gl_FragCoord.y / 2.0), 2.0); // Updated for 2x resolution
        float ditheredGrayValue = grayValue + (0.3 * ditherValue); // Increased dithering intensity
        float threshold = 0.5;
        float finalColor = step(threshold, ditheredGrayValue);

        fragColor = vec4(finalColor, finalColor, finalColor, 1.0);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
`,fragmentShaderSourcePlasma=`
    precision mediump float;
    uniform float iTime;
    uniform vec2 iResolution;

    vec2 motionFunction(float i) {
        float t = iTime;

        return vec2(
            (cos(t * .31 + i * 3.) + cos(t * .11 + i * 14.) + cos(t * .78 + i * 30.) + cos(t * .55 + i * 10.)) / 4.,
            (cos(t * .13 + i * 33.) + cos(t * .66 + i * 38.) + cos(t * .42 + i * 83.) + cos(t * .9 + i * 29.)) / 4.
        );
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = (fragCoord - .5 * iResolution.xy) / iResolution.x;
        
        float alias = 100. + 40. * motionFunction(7.).x;
        uv = floor(uv * alias) / alias;
        vec2 uv1 = uv + motionFunction(1.);
        vec2 uv2 = uv + motionFunction(2.);
        vec2 uv3 = uv + motionFunction(3.);
        vec3 col1 = .5 + .5 * cos(length(uv1) * 20. + uv1.xyx + vec3(0, 2, 4));
        vec3 col2 = .5 + .5 * cos(length(uv2) * 10. + uv2.xyx + vec3(0, 2, 4));
        vec3 col3 = .5 + .5 * cos(length(uv3) * 10. + uv3.xyx + vec3(0, 2, 4));
        vec3 col = col1 - col2 + col3;

        fragColor = vec4(col, 1.);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
`,canvas=document.getElementById("shaderCanvas"),gl=canvas.getContext("webgl"),vertexShader=gl.createShader(gl.VERTEX_SHADER),fragmentShaderPlasma=(gl.shaderSource(vertexShader,vertexShaderSource),gl.compileShader(vertexShader),gl.createShader(gl.FRAGMENT_SHADER)),fragmentShader1Bit=(gl.shaderSource(fragmentShaderPlasma,fragmentShaderSourcePlasma),gl.compileShader(fragmentShaderPlasma),gl.createShader(gl.FRAGMENT_SHADER)),programPlasma=(gl.shaderSource(fragmentShader1Bit,fragmentShaderSource1Bit),gl.compileShader(fragmentShader1Bit),gl.createProgram()),program1Bit=(gl.attachShader(programPlasma,vertexShader),gl.attachShader(programPlasma,fragmentShaderPlasma),gl.linkProgram(programPlasma),gl.createProgram()),positionAttributeLocationPlasma=(gl.attachShader(program1Bit,vertexShader),gl.attachShader(program1Bit,fragmentShader1Bit),gl.linkProgram(program1Bit),gl.getAttribLocation(programPlasma,"position")),positionAttributeLocation1Bit=(gl.enableVertexAttribArray(positionAttributeLocationPlasma),gl.getAttribLocation(program1Bit,"position")),positionBuffer=(gl.enableVertexAttribArray(positionAttributeLocation1Bit),gl.createBuffer()),positions=(gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer),[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),resolutionUniformLocationPlasma=(gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW),gl.getUniformLocation(programPlasma,"iResolution")),timeUniformLocationPlasma=gl.getUniformLocation(programPlasma,"iTime"),resolutionUniformLocation1Bit=gl.getUniformLocation(program1Bit,"iResolution"),timeUniformLocation1Bit=gl.getUniformLocation(program1Bit,"iTime");let clickCount=0,plasmaVisible=!1;function renderPlasma(){var o={width:window.innerWidth,height:window.innerHeight};canvas.width=o.width,canvas.height=o.height,gl.clearColor(0,0,0,1),gl.clear(gl.COLOR_BUFFER_BIT),gl.viewport(0,0,gl.canvas.width,gl.canvas.height),gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer),gl.vertexAttribPointer(positionAttributeLocationPlasma,2,gl.FLOAT,!1,0,0),gl.uniform2f(resolutionUniformLocationPlasma,o.width,o.height),gl.uniform1f(timeUniformLocationPlasma,performance.now()/1e3),gl.useProgram(programPlasma),gl.drawArrays(gl.TRIANGLES,0,6)}function render1Bit(){var o={width:window.innerWidth,height:window.innerHeight};canvas.width=o.width,canvas.height=o.height,gl.clearColor(0,0,0,1),gl.clear(gl.COLOR_BUFFER_BIT),gl.viewport(0,0,gl.canvas.width,gl.canvas.height),gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer),gl.vertexAttribPointer(positionAttributeLocation1Bit,2,gl.FLOAT,!1,0,0),gl.uniform2f(resolutionUniformLocation1Bit,o.width,o.height),gl.uniform1f(timeUniformLocation1Bit,performance.now()/1e3),gl.useProgram(program1Bit),gl.drawArrays(gl.TRIANGLES,0,6)}function render(){(plasmaVisible?renderPlasma:render1Bit)(),requestAnimationFrame(render)}render();const mac=document.getElementById("mac"),backgroundMusic=(mac.addEventListener("click",()=>{clickCount++,plasmaVisible=clickCount%2!=0}),document.getElementById("backgroundMusic"));function startBackgroundMusic(){backgroundMusic.play(),backgroundMusic.loop=!0}backgroundMusic.volume=.55,document.addEventListener("click",startBackgroundMusic);