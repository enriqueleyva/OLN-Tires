function fillModal(title, description, imageUrl) {
	document.getElementById("productModalLabel").textContent = title;
	document.getElementById("modalDescription").textContent = description;
	// document.getElementById('modalImage').src = imageUrl;
}

gsap.registerPlugin(ScrollTrigger);

// gsap.utils.toArray(".brand-logo").forEach((logo, index) => {
// 	gsap.fromTo(
// 		logo,
// 		{
// 			opacity: 0,
// 			rotate: -360,
// 			scale: 0.6,
// 		},
// 		{
// 			opacity: 1,
// 			rotate: 0,
// 			scale: 1,
// 			duration: 1,
// 			delay: index * 0.1,
// 			ease: "bounce.out",
// 			scrollTrigger: {
// 				trigger: logo,
// 				start: "top 90%",
// 				toggleActions: "play none none none",
// 			},
// 		}
// 	);
// });

document.querySelectorAll(".brand-logo").forEach((logo) => {
	logo.addEventListener("mouseenter", () => {
		gsap.to(logo, {
			rotation: 10,
			scale: 1.05,
			boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
			duration: 0.3,
			ease: "power2.out",
		});
	});

	logo.addEventListener("mouseleave", () => {
		gsap.to(logo, {
			rotation: 0,
			scale: 1,
			boxShadow: "0px 0px 0px rgba(0,0,0,0)",
			duration: 0.3,
			ease: "power2.inOut",
		});
	});
});

let renderer, camera, scene, controls;
let model3D = null; // Declarar variable global para el modelo
document
	.getElementById("productModal")
	.addEventListener("shown.bs.modal", function () {
		const container = document.getElementById("tresDe");
		container.innerHTML = ""; // Limpiar canvas anterior si existe
		const width = container.clientWidth;
		const height = container.clientHeight;

		// Crear escena
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(width, height);
		container.appendChild(renderer.domElement);

		const topLight = new THREE.DirectionalLight(0xffffff, 0.3);
		scene.add(topLight);

		const frontLight = new THREE.DirectionalLight(0xffffff, 0.2);
		// frontLight.position.set(0, 1, 1).normalize();
		scene.add(frontLight);

		const backLight = new THREE.DirectionalLight(0xffffff, 0.2);
		// backLight.position.set(0, -1, -1).normalize();
		scene.add(backLight);

		const pointLight = new THREE.PointLight(0xffffff, 0.3);
		// pointLight.position.set(5, 5, 5);
		scene.add(pointLight);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
		scene.add(ambientLight);

		// Controles con amortiguación
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.1;
		controls.minDistance = 1;
		controls.maxDistance = 10;

		// Cargar el modelo GLTF
		const loader = new THREE.GLTFLoader();
		loader.load("img/models/llanta.gltf", function (gltf) {
			const model = gltf.scene;
			model3D = model; // Guardar la referencia

			// Calcula el tamaño del modelo y ajusta escala
			const box = new THREE.Box3().setFromObject(model);
			const size = new THREE.Vector3();
			box.getSize(size);

			const scale = Math.min(1 / size.x, 1 / size.y, 1 / size.z) * 2.5; // factor ajustable
			model.scale.set(scale, scale, scale);
			// model.scale.set(3, 3, 3);
			scene.add(model);

			// Cargar la textura
			const textureLoader = new THREE.TextureLoader();

			// Posicionar la cámara
			camera.position.z = 3;
		});

		const animate = function () {
			requestAnimationFrame(animate);

			// Rotar el modelo si ya está cargado
			if (model3D) {
				model3D.rotation.y += 0.001;
			}
			controls.update(); // Para amortiguación
			renderer.render(scene, camera);
		};
		animate();

		// Ajustar el renderizado al tamaño de la ventana
		window.addEventListener("resize", function () {
			const width = container.clientWidth;
			const height = container.clientHeight;
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		});
	});
