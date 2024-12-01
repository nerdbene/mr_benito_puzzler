// 🎮 Let the puzzle party begin! 
document.addEventListener('DOMContentLoaded', () => {
    // 🎯 Setting up our puzzle playground
    const puzzleArea = document.getElementById('puzzle-area');
    const controls = document.getElementById('controls');

    // 🚀 Mission Control Center
    function init() {
        console.log('🎪 Teacher Puzzler is ready to rock and roll!');
        // Add initialization code here
    }

    // 3... 2... 1... Blast off! 🚀
    init();

    const canvas = document.getElementById('puzzleCanvas');
    const ctx = canvas.getContext('2d');
    let originalImage = null;
    let puzzlePieces = [];

    // 📏 Size matters! Keeping things neat and tidy
    const MAX_WIDTH = 800;   // Wide enough to be fun, small enough to be friendly
    const MAX_HEIGHT = 600;  // Tall enough to be challenging, short enough to fit on screen

    // 📸 Picture perfect upload handler
    document.getElementById('imageUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    // 🎨 Time to make it Instagram-worthy
                    let width = img.width;
                    let height = img.height;
                    
                    // 🔄 Making sure it's not too chunky
                    if (width > MAX_WIDTH) {
                        height = (MAX_WIDTH * height) / width;
                        width = MAX_WIDTH;
                    }
                    if (height > MAX_HEIGHT) {
                        width = (MAX_HEIGHT * width) / height;
                        height = MAX_HEIGHT;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    originalImage = img;
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 🧩 The piece-maker - where puzzle pieces are born!
    function createPiece(img, x, y, width, height, number) {
        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = width;
        pieceCanvas.height = height;
        const pieceCtx = pieceCanvas.getContext('2d');
        
        // 🎨 Carefully cutting out our puzzle piece
        pieceCtx.drawImage(img, x, y, width, height, 0, 0, width, height);
        
        // ✨ Adding some fancy dotted borders
        pieceCtx.setLineDash([5, 5]);
        pieceCtx.strokeStyle = '#000';
        pieceCtx.lineWidth = 2;
        pieceCtx.strokeRect(0, 0, width, height);
        
        return {
            canvas: pieceCanvas,
            originalX: x,
            originalY: y,
            width: width,
            height: height,
            number: number
        };
    }

    // 🎲 The magical shuffle dance - Fisher-Yates style!
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];  // Do the shuffle shuffle! 💃
        }
        return array;
    }

    // 🎪 The main show - Let's make some puzzle magic!
    document.getElementById('makePuzzleBtn').addEventListener('click', function() {
        if (!originalImage) {
            alert('Oops! We need a picture first! 📸');
            return;
        }
        
        const pieces = parseInt(document.getElementById('piecesInput').value);
        if (pieces < 6 || pieces > 20) {
            alert('Let\'s keep it fun - choose between 6 and 20 pieces! 🎯');
            return;
        }
        
        // 📐 Time for some puzzle math magic
        const ratio = canvas.width / canvas.height;
        let cols = Math.round(Math.sqrt(pieces * ratio));
        let rows = Math.round(pieces / cols);
        while (rows * cols < pieces) {
            cols++;  // Making sure we have room for everyone!
        }
        
        // 🏭 Puzzle piece factory in action!
        puzzlePieces = [];
        const pieceWidth = canvas.width / cols;
        const pieceHeight = canvas.height / rows;
        
        // 🎨 Creating each unique piece with love
        let pieceNumber = 1;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (pieceNumber <= pieces) {
                    const piece = createPiece(
                        originalImage,
                        x * pieceWidth,
                        y * pieceHeight,
                        pieceWidth,
                        pieceHeight,
                        pieceNumber
                    );
                    puzzlePieces.push(piece);
                    pieceNumber++;
                }
            }
        }
        
        // 🎲 Shuffle shuffle, mix and mingle!
        shuffleArray(puzzlePieces);
        
        // 📏 Making space for our shuffled masterpiece
        const shuffledRows = Math.ceil(pieces / cols);
        canvas.height = shuffledRows * pieceHeight;
        
        // 🧹 Clean slate for our new creation
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 🎨 Time to display our shuffled masterpiece
        let currentX = 0;
        let currentY = 0;
        
        puzzlePieces.forEach((piece, index) => {
            ctx.drawImage(piece.canvas, currentX, currentY);
            
            currentX += pieceWidth;
            if (currentX >= canvas.width) {
                currentX = 0;
                currentY += pieceHeight;
            }
        });
    });

    // 💾 Save your masterpiece for later!
    document.getElementById('downloadBtn').addEventListener('click', function() {
        if (!canvas.toDataURL) {
            alert('Oops! Your browser is camera shy! 📸');
            return;
        }
        
        const link = document.createElement('a');
        link.download = 'puzzle.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});
