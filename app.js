document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const contractAddress = "0x6d3a8fd5cf89f9a429bfadfd970968f646aff325";
    const baseRpcUrl = "https://base.llamarpc.com";
    const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"subject","type":"address"}],"name":"ErrAlreadyExists","type":"error"},{"inputs":[],"name":"ErrUnexistingReview","type":"error"},{"inputs":[],"name":"ErrUnsorted","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"reviewId","type":"uint256"},{"indexed":true,"internalType":"address","name":"author","type":"address"},{"indexed":true,"internalType":"address","name":"subject","type":"address"}],"name":"ReviewArchived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"score","type":"uint8"},{"indexed":true,"internalType":"address","name":"author","type":"address"},{"indexed":true,"internalType":"address","name":"subject","type":"address"},{"indexed":false,"internalType":"address","name":"paymentToken","type":"address"},{"indexed":false,"internalType":"string","name":"comment","type":"string"},{"indexed":false,"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"components":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"internalType":"struct Attestation.Signature","name":"signature","type":"tuple"}],"indexed":false,"internalType":"struct Attestation.AttestationDetails","name":"attestationDetails","type":"tuple"},{"indexed":true,"internalType":"uint256","name":"reviewId","type":"uint256"}],"name":"ReviewCreated","type":"event"},{"inputs":[{"internalType":"uint8","name":"score","type":"uint8"},{"internalType":"address","name":"subject","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"string","name":"comment","type":"string"},{"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"components":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"internalType":"struct Attestation.Signature","name":"signature","type":"tuple"}],"internalType":"struct Attestation.AttestationDetails","name":"attestationDetails","type":"tuple"}],"name":"addReview","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"reviewId","type":"uint256"}],"name":"archiveReview","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"reviewId","type":"uint256"}],"name":"getReview","outputs":[{"components":[{"internalType":"uint8","name":"score","type":"uint8"},{"internalType":"address","name":"author","type":"address"},{"internalType":"address","name":"subject","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"string","name":"comment","type":"string"},{"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"components":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"internalType":"struct Attestation.Signature","name":"signature","type":"tuple"}],"internalType":"struct Attestation.AttestationDetails","name":"attestationDetails","type":"tuple"}],"internalType":"struct Review","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"author","type":"address"},{"internalType":"uint256","name":"from","type":"uint256"},{"internalType":"uint256","name":"to","type":"uint256"}],"name":"getReviewsByAuthor","outputs":[{"components":[{"internalType":"uint8","name":"score","type":"uint8"},{"internalType":"address","name":"author","type":"address"},{"internalType":"address","name":"subject","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"string","name":"comment","type":"string"},{"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"components":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"internalType":"struct Attestation.Signature","name":"signature","type":"tuple"}],"internalType":"struct Attestation.AttestationDetails","name":"attestationDetails","type":"tuple"}],"internalType":"struct Review[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"subject","type":"address"},{"internalType":"uint256","name":"from","type":"uint256"},{"internalType":"uint256","name":"to","type":"uint256"}],"name":"getReviewsBySubject","outputs":[{"components":[{"internalType":"uint8","name":"score","type":"uint8"},{"internalType":"address","name":"author","type":"address"},{"internalType":"address","name":"subject","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"string","name":"comment","type":"string"},{"internalType":"string","name":"metadata","type":"string"},{"components":[{"internalType":"bytes32","name":"schema","type":"bytes32"},{"components":[{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"uint8","name":"v","type":"uint8"}],"internalType":"struct Attestation.Signature","name":"signature","type":"tuple"}],"internalType":"struct Attestation.AttestationDetails","name":"attestationDetails","type":"tuple"}],"internalType":"struct Review[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reviewCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"reviewsByAuthor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"reviewsBySubject","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

    // --- Get Elements from the Page ---
    const searchButton = document.getElementById('searchButton');
    const addressInput = document.getElementById('addressInput');
    const loader = document.getElementById('loader');
    const receivedList = document.getElementById('receivedList');
    const givenList = document.getElementById('givenList');
    const errorMessage = document.getElementById('errorMessage');

    searchButton.addEventListener('click', fetchReviews);

    async function fetchReviews() {
        // 1. Prepare UI
        loader.style.display = 'block';
        searchButton.disabled = true;
        receivedList.innerHTML = '';
        givenList.innerHTML = '';
        errorMessage.textContent = '';

        const walletAddress = addressInput.value.trim();
        if (!ethers.utils.isAddress(walletAddress)) {
            errorMessage.textContent = 'Please enter a valid wallet address.';
            loader.style.display = 'none';
            searchButton.disabled = false;
            return;
        }

        try {
            // 2. Connect to the blockchain
            const provider = new ethers.providers.JsonRpcProvider(baseRpcUrl);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            // 3. Create filters for blockchain events
            // Filter for reviews given BY the address (author is the 1st indexed topic)
            const givenFilter = contract.filters.ReviewCreated(null, walletAddress);
            
            // Filter for reviews received BY the address (subject is the 2nd indexed topic)
            const receivedFilter = contract.filters.ReviewCreated(null, null, walletAddress);

            // 4. Fetch both sets of events at the same time
            const [givenEvents, receivedEvents] = await Promise.all([
                contract.queryFilter(givenFilter, 0, 'latest'),
                contract.queryFilter(receivedFilter, 0, 'latest')
            ]);
            
            // 5. Display the results
            displayReviews(givenList, givenEvents, "given");
            displayReviews(receivedList, receivedEvents, "received");

        } catch (error) {
            console.error(error);
            errorMessage.textContent = 'An error occurred while fetching data.';
        } finally {
            loader.style.display = 'none';
            searchButton.disabled = false;
        }
    }

    function displayReviews(listElement, events, type) {
        if (events.length === 0) {
            listElement.innerHTML = `<li>No reviews ${type}.</li>`;
            return;
        }

        events.forEach(event => {
            const { author, subject, score, comment } = event.args;
            const li = document.createElement('li');
            
            const relevantAddress = (type === "given") ? subject : author;
            const prefix = (type === "given") ? "To:" : "From:";

            li.innerHTML = `
                <div>${prefix} <span class="address">${relevantAddress}</span></div>
                <div>Score: <strong>${score}/5</strong></div>
                <div class="comment">"${comment}"</div>
            `;
            listElement.appendChild(li);
        });
    }
});
