import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Function to create the room (walls, floor, and ceiling)
function createRoom(scene) {
  const floorTexture = new THREE.TextureLoader().load('textures/floor.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 10);
  
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
    roughness: 0.8,
    metalness: 0.2
  });
  
  const floorGeometry = new THREE.PlaneGeometry(400, 500);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.1;
  scene.add(floor);

  const wallTexture = new THREE.TextureLoader().load('textures/wall.jpg');
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    side: THREE.DoubleSide,
    roughness: 0.6,
    metalness: 0.1
  });

  const wallFront = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), wallMaterial);
  wallFront.position.set(0, 100, 250);
  scene.add(wallFront);

  const wallBack = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), wallMaterial);
  wallBack.position.set(0, 100, -250);
  wallBack.rotation.y = Math.PI;
  scene.add(wallBack);

  const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(500, 200), wallMaterial);
  wallLeft.position.set(-200, 100, 0);
  wallLeft.rotation.y = Math.PI / 2;
  scene.add(wallLeft);

  const wallRight = new THREE.Mesh(new THREE.PlaneGeometry(500, 200), wallMaterial);
  wallRight.position.set(200, 100, 0);
  wallRight.rotation.y = -Math.PI / 2;
  scene.add(wallRight);

  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, side: THREE.DoubleSide, roughness: 0.8, metalness: 0.1 });
  const ceilingGeometry = new THREE.PlaneGeometry(400, 500);
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.position.set(0, 200, 0);
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);
}

function createArtwork(x, y, z, artworkImage, name = "Untitled", description = "No description available", scene, wall) {
  const texture = new THREE.TextureLoader().load(artworkImage);
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true
  });
  const artwork = new THREE.Mesh(geometry, material);
  artwork.position.set(x, y, z);

  if (wall === 'left') {
    artwork.rotation.y = Math.PI / 2;
  } else if (wall === 'right') {
    artwork.rotation.y = -Math.PI / 2;
  }

  scene.add(artwork);

  // Attach painting information as a property to the artwork
  artwork.name = name;
  artwork.description = description;

  return artwork;
}

function Gallery() {
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [editedInfo, setEditedInfo] = useState({ name: '', description: '' });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const galleryElement = document.getElementById('gallery');
    galleryElement.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5).normalize();
    scene.add(ambientLight, directionalLight);

    createRoom(scene);

    const artworkImages = [];
    for (let i = 1; i <= 16; i++) {
      artworkImages.push(`artwork-images/art${i}.jpg`);
    }

    const artworkInfo = [
      { 
        name: 'Mona Lisa', 
        createdBy: 'Leonardo da Vinci', 
        description: 'A world-renowned portrait by Leonardo da Vinci, showcasing a woman with an enigmatic smile that has captivated audiences for centuries. This Renaissance masterpiece is celebrated for its detailed rendering of the human form, the soft sfumato technique, and the mysterious expression of the subject.' 
      },
      { 
        name: 'Flaming June', 
        createdBy: 'Frederic Leighton', 
        description: 'A masterpiece of Victorian neoclassical art, "Flaming June" depicts a sleeping woman in a flowing orange gown, exuding warmth and tranquility. The vibrant hues and delicate composition embody a perfect harmony of light, color, and texture.' 
      },
      { 
        name: 'Girl with a Pearl Earring', 
        createdBy: 'Johannes Vermeer', 
        description: 'Often referred to as the "Mona Lisa of the North," this iconic painting captures the quiet allure of a young girl with a pearl earring. Vermeer’s attention to detail and mastery of light bring a lifelike quality to the subject, creating a timeless piece.' 
      },
      { 
        name: 'Self-Portrait with a Felt Hat', 
        createdBy: 'Vincent van Gogh', 
        description: 'A striking self-portrait by van Gogh during his time in Paris, showcasing his unique style of bold brushstrokes and vibrant colors. The painting reflects his evolving artistic technique and offers a glimpse into the artist’s introspective nature.' 
      },
      { 
        name: 'Self-Portrait with Thorn Necklace and Hummingbird', 
        createdBy: 'Frida Kahlo', 
        description: 'A deeply symbolic self-portrait reflecting Kahlo’s physical and emotional struggles. The thorn necklace and hummingbird are steeped in meaning, representing pain, resilience, and the dualities of life and death. The lush background emphasizes her connection to nature.' 
      },
      { 
        name: 'A Vase of Irises', 
        createdBy: 'Vincent van Gogh', 
        description: 'A vibrant still life by van Gogh, capturing the delicate beauty of irises in a vase. His bold use of colors and textures conveys a sense of movement and life, transforming a simple composition into an evocative work of art.' 
      },
      { 
        name: 'The Persistence of Time', 
        createdBy: 'Salvador Dalí', 
        description: 'A surrealist masterpiece featuring melting clocks draped over a dreamlike landscape. This iconic work by Dalí explores themes of time, memory, and the fluid nature of reality, making it a cornerstone of modern art.' 
      },
      { 
        name: 'The Swing', 
        createdBy: 'Jean-Honoré Fragonard', 
        description: 'A quintessential Rococo painting, "The Swing" depicts a playful and elegant scene of a young woman on a swing, with her suitor watching from below. The painting is full of movement, lightheartedness, and intricate detail, reflecting the era’s charm.' 
      },
      { 
        name: 'A Sunday Afternoon on the Island of La Grande Jatte', 
        createdBy: 'Georges Seurat', 
        description: 'A famous example of pointillism, this painting captures a serene afternoon by the river. Seurat meticulously placed dots of color to create an image that appears detailed and vibrant from a distance, embodying both innovation and beauty.' 
      },
      { 
        name: 'The Oath of the Horatii', 
        createdBy: 'Jacques-Louis David', 
        description: 'A powerful neoclassical painting dramatizing the Roman legend of the Horatii brothers. The work captures the themes of loyalty, sacrifice, and patriotism, using a stark and dramatic composition to emphasize its emotional depth.' 
      },
      { 
        name: 'Café Terrace at Night', 
        createdBy: 'Vincent van Gogh', 
        description: 'This lively nighttime scene depicts a café in Arles under a starry sky. Van Gogh’s masterful use of bold colors and dynamic lighting creates a sense of warmth and wonder, making it one of his most beloved works.' 
      },
      { 
        name: 'Joan of Arc 1864', 
        createdBy: 'Dante Gabriel Rossetti', 
        description: 'A Pre-Raphaelite depiction of Joan of Arc, emphasizing her spiritual strength and determination. The painting’s rich color palette and intricate details highlight Rossetti’s dedication to beauty and symbolism.' 
      },
      { 
        name: 'The Water Lilies', 
        createdBy: 'Claude Monet', 
        description: 'An impressionist masterpiece, "The Water Lilies" captures the serene beauty of Monet’s garden pond at Giverny. The painting’s soft brushstrokes and harmonious colors evoke a sense of peace and reflection.' 
      },
      { 
        name: 'Still Life with Cherries and Peaches', 
        createdBy: 'Paul Cézanne', 
        description: 'A Post-Impressionist still life that emphasizes color, shape, and light. Cézanne’s meticulous arrangement of cherries and peaches transforms ordinary objects into a study of form and texture, bridging realism and abstraction.' 
      }
    ];
    
    

    const positions = [
      { wall: 'front', x: -120, y: 100, z: 240 },
      { wall: 'front', x: 0, y: 100, z: 240 },
      { wall: 'front', x: 120, y: 100, z: 240 },
      { wall: 'back', x: 120, y: 100, z: -240 },
      { wall: 'back', x: 0, y: 100, z: -240 },
      { wall: 'back', x: -120, y: 100, z: -240 },
      { wall: 'left', x: -190, y: 100, z: 180 },
      { wall: 'left', x: -190, y: 100, z: 60 },
      { wall: 'left', x: -190, y: 100, z: -60 },
      { wall: 'left', x: -190, y: 100, z: -180 },
      { wall: 'right', x: 190, y: 100, z: 180 },
      { wall: 'right', x: 190, y: 100, z: 60 },
      { wall: 'right', x: 190, y: 100, z: -60 },
      { wall: 'right', x: 190, y: 100, z: -180 }
    ];

    const artworks = positions.map((pos, index) => {
      const image = artworkImages[index] || '';
      const info = artworkInfo[index] || {};
      return createArtwork(
        pos.x, 
        pos.y, 
        pos.z, 
        image, 
        info.name, 
        info.description, 
        scene, 
        pos.wall
      );
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(artworks);
      if (intersects.length > 0) {
        const clickedPainting = intersects[0].object;
        setSelectedPainting(clickedPainting);
        setEditedInfo({ name: clickedPainting.name, description: clickedPainting.description });
      }
    };

    window.addEventListener('click', onMouseClick, false);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    camera.position.set(20, 100, 200);
    controls.maxDistance = 500;
    controls.minDistance = 50;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.minPolarAngle = Math.PI / 10;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      controls.dispose();
      renderer.dispose();
      window.removeEventListener('click', onMouseClick);
    };
  }, []);

  const closeTextBubble = () => {
    setSelectedPainting(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveEdits = () => {
    if (selectedPainting) {
      selectedPainting.name = editedInfo.name;
      selectedPainting.description = editedInfo.description;
      setSelectedPainting(selectedPainting);
    }
  };

  return (
    <div id="gallery">
      {selectedPainting && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '300px'
        }}>
          <div>
            <h3>{selectedPainting.name}</h3>
            <p>{selectedPainting.description}</p>
          </div>
          <button
            onClick={closeTextBubble}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              marginTop: '5px',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Gallery;
