class GameObject{

    vertexShaderSource = `
        attribute vec4 a_position;
        attribute vec3 a_normal;
        attribute vec4 in_color;
        attribute vec2 a_texturecoord;


        uniform mat4 u_worldInverseTranspose;
        uniform mat4 u_objectPosition;
        uniform mat4 u_world;

        uniform mat4 u_cameraTransform;
        

        uniform vec3 u_lightWorldPosition;
        uniform vec3 u_viewWorldPosition;
        

        varying vec4 out_color;
        varying vec3 v_normal;
        varying vec3 v_surfaceToLight;
        varying vec3 v_surfaceToView;
        varying vec2 v_texturecoord;


        void main(){
            gl_Position = (u_objectPosition * u_world) * a_position;
            vec3 surfaceWorldPosition = (u_objectPosition * (a_position)).xyz;
            out_color = in_color;
            v_normal = mat3(u_worldInverseTranspose) * a_normal;
            v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
            v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
            v_texturecoord = a_texturecoord;
        }
`
    fragmentShaderSource = `
        precision mediump float;

        varying vec4 out_color;
        varying vec3 v_normal;
        varying vec3 v_surfaceToLight;
        varying vec3 v_surfaceToView;
        varying vec2 v_texturecoord;

        uniform sampler2D diffuseMap;

        uniform vec3 diffuse;
        uniform vec3 ambient;
        uniform vec3 emissive;
        uniform vec3 specular;
        uniform float shininess;
        uniform float opacity;
        uniform vec3 u_ambientLight;

        uniform vec3 u_highlight;
        uniform bool yellow;
        uniform bool brown;


        void main(){
            vec3 normal = normalize(v_normal);
            float minimumLightValue = 0.15;
            vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
            vec3 surfaceToViewDirection = normalize(v_surfaceToView);
            vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

            float light = max(dot(normal, surfaceToLightDirection),minimumLightValue);

            float specularLight = clamp(dot(normal, halfVector), 0.0, 1.0);

              vec4 diffuseMapColor = texture2D(diffuseMap, v_texturecoord);
              vec3 effectiveDiffuse = diffuse * diffuseMapColor.rgb;
              float effectiveOpacity = opacity * diffuseMapColor.a * out_color.a;

            float specularF = 0.0;
            if (light > minimumLightValue) {
                specularF = max(pow(dot(normal, halfVector), shininess), 0.00000005);
            }


            if(yellow){
                gl_FragColor = vec4(
                    emissive + u_highlight +
                    ambient * u_ambientLight +
                    vec3(0.55,0.4,0) * light +
                    specular * specularF,
                    effectiveOpacity);
            }
            else if (brown){
                gl_FragColor = vec4(
                    emissive + u_highlight +
                    ambient * u_ambientLight +
                    vec3(0.27,0.17,.06) * light +
                    specular * specularF,
                    effectiveOpacity);
            }
            else{
                gl_FragColor = vec4(
                        emissive + u_highlight +
                        ambient * u_ambientLight +
                        effectiveDiffuse * light +
                        specular * specularF,
                        effectiveOpacity);
            }


            
        }
`
    #baseUniformArray = new Array()
    #uniforms = new Array()
    #staticUniforms = new Array()
    #attributes = new Array()
    #position = [0,0,0]
    #rotation = [0,0,0]
    #scale    = [1,1,1]
    #vertexShader
    #fragmentShader
    transform = mat4.rotationX(0)

    program 


    positions = new Float32Array([
      -50,75,15,-50,-75,15,-20,75,15,-50,-75,15,-20,-75,15,-20,75,15,-20,75,15,-20,45,15,50,75,15,-20,45,15,50,45,15,50,75,15,-20,15,15,-20,-15,15,17,15,15,-20,-15,15,17,-15,15,17,15,15,-50,75,-15,-20,75,-15,-50,-75,-15,-50,-75,-15,-20,75,-15,-20,-75,-15,-20,75,-15,50,75,-15,-20,45,-15,-20,45,-15,50,75,-15,50,45,-15,-20,15,-15,17,15,-15,-20,-15,-15,-20,-15,-15,17,15,-15,17,-15,-15,-50,75,15,50,75,15,50,75,-15,-50,75,15,50,75,-15,-50,75,-15,50,75,15,50,45,15,50,45,-15,50,75,15,50,45,-15,50,75,-15,-20,45,15,-20,45,-15,50,45,-15,-20,45,15,50,45,-15,50,45,15,-20,45,15,-20,15,-15,-20,45,-15,-20,45,15,-20,15,15,-20,15,-15,-20,15,15,17,15,-15,-20,15,-15,-20,15,15,17,15,15,17,15,-15,17,15,15,17,-15,-15,17,15,-15,17,15,15,17,-15,15,17,-15,-15,-20,-15,15,-20,-15,-15,17,-15,-15,-20,-15,15,17,-15,-15,17,-15,15,-20,-15,15,-20,-75,-15,-20,-15,-15,-20,-15,15,-20,-75,15,-20,-75,-15,-50,-75,15,-50,-75,-15,-20,-75,-15,-50,-75,15,-20,-75,-15,-20,-75,15,-50,75,15,-50,75,-15,-50,-75,-15,-50,75,15,-50,-75,-15,-50,-75,15
    ])
    textureCoords = new Float32Array([1])

    colorData = [
        // left column front
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
    
        // top rung front
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
    
        // middle rung front
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
      200,  70, 120,
    
        // left column back
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
    
        // top rung back
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
    
        // middle rung back
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
      80, 70, 200,
    
        // top
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,
      70, 200, 210,
    
        // top rung right
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,
      200, 200, 70,
    
        // under top rung
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,
      210, 100, 70,
    
        // between top rung and middle
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,
      210, 160, 70,
    
        // top of middle rung
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,
      70, 180, 210,
    
        // right of middle rung
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,
      100, 70, 210,
    
        // bottom of middle rung.
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,
      76, 210, 100,
    
        // right of bottom
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,
      140, 210, 80,
    
        // bottom
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,
      90, 130, 110,
    
        // left side
      160, 160, 220,
      160, 160, 220,
      160, 160, 220,
      160, 160, 220,
      160, 160, 220,
      160, 160, 220
    ]
    normals = new Float32Array([
      // left column front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    
      // top rung front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    
      // middle rung front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    
      // left column back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
    
      // top rung back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
    
      // middle rung back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
    
      // top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    
      // top rung right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
    
      // under top rung
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
    
      // between top rung and middle
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
    
      // top of middle rung
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    
      // right of middle rung
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
    
      // bottom of middle rung.
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
    
      // right of bottom
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
    
      // bottom
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
    
      // left side
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0
    ]);
  
    constructor(){
        gameObjects.push(this)
        if(gl == null){
            console.log("CANNOT CREATE GAMEOBJECT WITHOUT GL CONTEXT CREATED FIRST")
        }
        this.#vertexShader = initializeShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource);
        this.#fragmentShader = initializeShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource);
        this.program = createProgram(gl, this.#vertexShader, this.#fragmentShader)
        this.setDefaultAttributes()
    }

    setTexture(textureName){
        // // Create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                    new Uint8Array([0, 255, 255, 255]));

        // Asynchronously load an image
        var image = new Image();
        image.src = "Objects/" + textureName;
        var temp = this
        image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.useProgram(temp.program)
            var texturelocation = gl.getUniformLocation(temp.program, "diffuseMap")
            gl.uniform1i(texturelocation, 0);
            draw()
        });

    }

    setDefaultAttributes(){
        if(typeof(positions) != Float32Array){
            this.positions = new Float32Array(this.positions)
        }
        if(typeof(this.normals) != Float32Array){
            this.normals = new Float32Array(this.normals)
        }

        if(typeof(this.texturecoords) != Float32Array){
            this.texturecoords = new Float32Array(this.texturecoords)
        }
        this.setAttributes([
            ["a_normal", this.normals],
            ["a_position", this.positions],
            ["in_color", new Uint8Array(this.colorData), [3,gl.UNSIGNED_BYTE,true,0,0]]
        ])
    }
    //Should just update values if nothing needs to be re-defined
    setAttributes(attributes){
      this.#attributes = new Array()
      for(var i = 0; i < attributes.length; i++){
        this.#attributes.push(new AttributeContainer(attributes[i][0],attributes[i][1],attributes[i][2]))
      }

      this.initializeAttributes()
    }
  
    setPosition(x,y,z){
        this.#position = [x,y,z]
        this.updateUniforms()
    }
    
    setRotation(x,y,z){
      this.#rotation = [x,y,z]
      this.updateUniforms()
    }

    getPosition(){
        return this.#position
    }
    getRotation(){
        return this.#rotation
    }
    getScale(){
        return this.#scale
    }


    async moveTo(position, time){
        var distance = [
            this.#position[0] - position[0],
            this.#position[1] - position[1],
            this.#position[2] - position[2],
        ]

        for(var i = 0; i < time; i++){
            var pos = this.getPosition()
            this.setPosition(
                pos[0] + distance[0]/time,
                pos[1] + distance[1]/time,
                pos[2] + distance[2]/time)
            
            draw()
            await GameObject.delay(1)
        }

    }
    

    static delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
  
    setScale(x,y,z){
      this.#scale = [x,y,z]
      this.updateUniforms()
    }

    setTextureCoordinates(coords){
        this.texturecoords = coords
    }
    updateTransform(){
        this.transform = mat4.rotationX(0)
    
        this.transform = mat4.translate(this.transform, this.#position[0], this.#position[1], this.#position[2])
        this.transform = mat4.rotateX(this.transform, this.#rotation[0])
        this.transform = mat4.rotateY(this.transform, this.#rotation[1])
        this.transform = mat4.rotateZ(this.transform, this.#rotation[2])
        this.transform = mat4.scale(this.transform, this.#scale[0], this.#scale[1], this.#scale[2])

        this.transform = mat4.multiply(viewProjectionMatrix, this.transform)
    }
    getUniforms(){
      return this.#baseUniformArray
    }
    //Updates the information for each of the global uniforms
    updateUniforms(){
      this.updateTransform()
      for(var i = 0; i < this.#baseUniformArray.length; i++){
        this.#uniforms[i].data = eval(this.#baseUniformArray[i])
      }
      this.initializeUniforms()
    }
    //Should be called to set a new batch of uniforms
    setUniforms(uniforms){
        this.#uniforms = new Array()
        for(var i = 0; i < uniforms.length; i++){
          this.#uniforms.push(new ShaderUniform(this.program, uniforms[i][0],eval(uniforms[i][1]),uniforms[i][2]))
          this.#baseUniformArray.push(uniforms[i][1])
        }
    }

    //Sets uniforms that aren't meant to ever be updated
    setStaticUniforms(uniforms){
        this.#staticUniforms = new Array()
        for(var i = 0; i < uniforms.length; i++){
            if(uniforms[i][1] != null){
                this.#staticUniforms.push(new ShaderUniform(this.program, uniforms[i][0],(uniforms[i][1]),uniforms[i][2]))
                this.#staticUniforms[i].bindFunc(this.program,this.#staticUniforms[i].location, this.#staticUniforms[i].data)
            }
            else{
                this.#staticUniforms.push(new ShaderUniform(this.program, uniforms[i][0],(uniforms[i][1]),uniforms[i][2]))
                //this.#staticUniforms[i].bindFunc(this.program,this.#staticUniforms[i].location, this.#staticUniforms[i].data)
            }
        }
    }
    //Actually sets the values inside our shaders
    initializeUniforms(){
      if(this.program == null){
        console.log("NO GL PROGRAM SET")
      }
      else{
        for(var i = 0; i < this.#uniforms.length; i++){
            this.#uniforms[i].bindFunc(this.program,this.#uniforms[i].location, this.#uniforms[i].data)
        }
        setUniformMat4f(this.program, "u_objectPosition", this.transform)
      }
    }
  
    initializeAttributes(){
      if(this.program == null){
        console.log("NO GL PROGRAM SET")
      }
      else{
        for(var i = 0; i < this.#attributes.length; i++){
          setShaderAttribute(this.program, this.#attributes[i].location, this.#attributes[i].data, this.#attributes[i].settings)
        }
        setShaderAttribute(this.program, "a_texturecoord", new Float32Array(this.textureCoords), [2, gl.FLOAT, false, 0, 0])
      }
    }
  }


class AttributeContainer{
    location
    data
    settings
    constructor(location, data, settings){
      if(settings == null){
        settings = new Array()
        settings[0] = 3
        settings[1] = gl.FLOAT
        settings[2] = false
        settings[3] = 0
        settings[4] = 0
        
      }
      else{
        for(var i = 0; i < 4; i++){
          if(settings[i] == null){
            switch (i){
            case 0:
              settings[0] = 3
              break
            case 1:
              settings[1] = gl.FLOAT
              break
            case 2:
              settings[2] = false
              break
            case 3:
              settings[3] = 0
              break
            case 4:
              settings[4] = 0
              break
            }
          }
        }
      }
      this.location = location
      this.data = data
      this.settings = settings
    }
}
  
class ShaderUniform{
    location
    bindFunc
    constructor(program, location, data, bindFunc){
        this.location = location
        this.bindFunc = bindFunc
        if(data != null){
            this.data = data
        }
        else{
            //console.log("ATTEMPTED TO SET UNIFORM WITH EMPTY DATASET " + location)
        }
        if(gl.getUniformLocation(program, location) == null){
            console.log("COULD NOT FIND SHADER UNIFORM " + location)
        }
    }
}