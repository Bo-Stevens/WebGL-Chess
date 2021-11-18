<!DOCTYPE html>

<head>
    <link rel="stylesheet" href="style.css">
    <title>WebGLChess</title>

</head>

<body>
    <div id="game">
        <canvas id="rendererWindow">

        </canvas>
        <div id="chatWindow">
            <div id="chatText">
                <ul id="chatTextUL">
                    <?php
                        echo "HELLO BOYS"
                    ?>
                    <li>Player 1: Hello man</li>
                    <li>Player 2: Hey, what's up?</li>
                    <li>Player 1: Lorem Ipsum</li>
                    <li>Player 2: Lorem Ipsum</li>
                    <li>Player 1: Lorem Ipsum</li>
                    <li>Player 2: Lorem Ipsum</li>
                    <li>Player 1: Lorem Ipsum</li>
                    <li>Player 2: Lorem Ipsum</li>
                    <li>Player 1: Lorem Ipsum</li>
                    <li>Player 2: Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </li>
                    <li>Player 1: Lorem Ipsum</li>
                    <li>Player 2: Lorem Ipsum</li>
                    <li>Player 1: Lorem Ipsum</li>
                    <li>Player 2: Lorem Ipsum</li>
    
                </ul>
            </div>
            <input type="text" id="chatTextBox">

        </div>
        <div id="editorUI">
            <span>Position X:</span>
            <input type="range" min="-1200" max="1200" value="0" class="slider" id="positionX"> 
            <span>Y: </span>
            <input type="range" min="-700" max="700" value="0" class="slider" id="positionY"> 
            <span>Z: </span>
            <input type="range" min="-1400" max="0" value="-700" class="slider" id="positionZ"> 
            <br>
            <span>Rotation X: </span>
            <input type="range" min="0" max="360" value="0" class="slider" id="rotationX"> 
            <span>Y: </span>
            <input type="range" min="0" max="360" value="0" class="slider" id="rotationY"> 
            <span>Z: </span>
            <input type="range" min="0" max="360" value="0" class="slider" id="rotationZ"> 
            <br>
            <span>Scale X:</span>
            <input type="range" min="0" max="100" value="10" class="slider" id="scaleX"> 
            <span>Y: </span>
            <input type="range" min="0" max="100" value="10" class="slider" id="scaleY"> 
            <span>Z: </span>
            <input type="range" min="0" max="100" value="10" class="slider" id="scaleZ">

            <br>
            <span>Camera Rotation X: </span>
            <input type="range" min="0" max="360" value="0" class="slider" id="camRotationX"> 
            <span>Y: </span>
            <input type="range" min="0" max="360" value="0" class="slider" id="camRotationY"> 
            <span>Z: </span>
            <input type="range" min="0" max="360" value="0" class="slider" id="camRotationZ"> 
            <br>
        </div>
        <img src="logo.svg" height ="100" width = "100" style="position: absolute">
        <img src="logo.svg" height ="50" width = "50" style="position: absolute; margin-left: 50px">
        
        <!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/NAIQyoPcjNM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 
        <input type="button" id="start" value="Start" ></input> -->
    </div>
    <script src="https://webglfundamentals.org/webgl/resources/webgl-utils.js"></script>
    <script src="renderer.js"></script>
    <script src="chatWindow.js"></script>

</body>


