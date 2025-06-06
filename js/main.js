
        function fillModal(title, description, imageUrl) {
            document.getElementById('productModalLabel').textContent = title;
            document.getElementById('modalDescription').textContent = description;
            // document.getElementById('modalImage').src = imageUrl;
        }

        let renderer, camera, scene, controls;

    document.getElementById('productModal').addEventListener('shown.bs.modal', function () {
        const container = document.getElementById('tresDe');
        container.innerHTML = ''; // Limpiar canvas anterior si existe

        // Crear escena
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true,  });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

         const frontLight = new THREE.DirectionalLight(0xffffff, 0.7);
        frontLight.position.set(0, 1, 1).normalize();
        scene.add(frontLight);
 
        const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
        backLight.position.set(0, -1, -1).normalize();
        scene.add(backLight);
 
        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
 
        // Añadir controles de órbita
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 10;
 
        let textura; // Variable para almacenar la textura
        let targetMesh; // Variable para almacenar la malla objetivo
 
        // Variables para controlar el desplazamiento y escala de la textura
        let offsetStep = 0.01; // Paso de desplazamiento
        let scaleStep = 0.01;   // Paso de escala
        let currentOffset = { x: 0, y: 0 }; // Desplazamiento actual
        let textureScale = 1;  // Escala actual de la textura
 
        // Variables para almacenar los valores iniciales de repeat y offset
        let initialRepeat = { u: 1, v: 1 };
        let initialOffset = { x: 0, y: 0 };
 
        // Cargar el modelo GLTF
        const loader = new THREE.GLTFLoader();
        loader.load('img/models/llanta.gltf', function (gltf) {
            const model = gltf.scene;
            // model.scale.set(3, 3, 3);
            scene.add(model);
 
            // Cargar la textura
            const textureLoader = new THREE.TextureLoader();

            // Posicionar la cámara
            camera.position.z = 5;
        });
 
        // Event listener para las teclas de dirección y escala
        window.addEventListener('keydown', function (event) {
            if (textura) {
                switch (event.key) {
                    case 'ArrowUp':
                        currentOffset.y += offsetStep;
                        break;
                    case 'ArrowDown':
                        currentOffset.y -= offsetStep;
                        break;
                    case 'ArrowLeft':
                        currentOffset.x -= offsetStep;
                        break;
                    case 'ArrowRight':
                        currentOffset.x += offsetStep;
                        break;
                    case 'a':
                    case 'a': // Algunas teclas '+' requieren '='
                        textureScale += scaleStep;
                        if (textureScale > 5) textureScale = 5; // Escala máxima
                        break;
                    case 'b':
                        textureScale -= scaleStep;
                        if (textureScale < 0.1) textureScale = 0.1; // Escala mínima
                        break;
                    case 'z':
                        textureScale = 1
                }
 
                // Actualizar la escala y el desplazamiento de la textura basados en los valores iniciales
                textura.repeat.set(initialRepeat.u * textureScale, initialRepeat.v * textureScale);
                textura.offset.set(initialOffset.x + currentOffset.x, initialOffset.y + currentOffset.y);
                textura.needsUpdate = true;
            }
        });
 
        // Función de animación
        const animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
 
        // Ajustar el renderizado al tamaño de la ventana
        window.addEventListener('resize', function () {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    });

        // Crear la escena, cámara y renderizador
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
         renderer = new THREE.WebGLRenderer();
        // renderer.setSize(window.innerWidth, window.innerHeight);
        // document.getElementById('tresDe').appendChild(renderer.domElement)
        // document.body.appendChild(renderer.domElement);
        const container = document.getElementById('tresDe');
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        container.appendChild(renderer.domElement);
 
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);
 
        // Añadir luces
        const topLight = new THREE.DirectionalLight(0xffffff, 0.7);
        topLight.position.set(0, 10, 0);
        scene.add(topLight);
