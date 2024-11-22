// Check for existing member on page load
document.addEventListener('DOMContentLoaded', () => {
    const member = JSON.parse(localStorage.getItem('member'));
    if (member) {
        showWelcomeMessage(member.name);
    }
});

window.addEventListener('load', function() {
    document.querySelector('.join-button').classList.add('initialized');
});

// Scroll effect for text elements
window.addEventListener('scroll', function() {
    if (window.innerWidth < 1000) { // Adjust this value as needed
        return;
    }
    var scrollPosition = window.pageYOffset;
    var textElements = document.querySelectorAll('.home-text, .pursue-text, #join');

    textElements.forEach(function(textElement) {
        textElement.style.top = (20 + scrollPosition * 0.04) + '%';
    });
});

// Modal functionality
var modal = document.getElementById('signupModal');
var joinButton = document.getElementById('join');
var closeButton = document.getElementById('closeModal');

joinButton.onclick = function(e) {
    e.preventDefault();
    showModal();
    // Hide "Pursue Higher" and "Join The Club" text
    document.querySelector('.pursue-text').style.display = 'none';
    document.getElementById('join').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        hideModal();
        document.querySelector('.pursue-text').style.display = 'block';
        document.getElementById('join').style.display = 'block';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^s\@]+$/;
    return emailRegex.test(email);
}

function showWelcomeMessage(name) {
    // Change main content
    const mainContent = document.querySelector('.home-text');
    mainContent.style.left = '65%';
    mainContent.innerHTML = `
        <div class="success-message">
            <h1>Welcome, ${name}.</h1>
            <p>We will be in touch shortly.</p>
        </div>
    `;

    const successMessage = document.querySelector('.success-message');
    successMessage.style.animation = 'fadeIn 1s ease-in-out';
}

// Form submission 
document.getElementById('signupForm').onsubmit = async function(e) {
    e.preventDefault();
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const name = nameField.value;
    const email = emailField.value;
    

    const errorMessage = emailField.parentElement.querySelector('.error-message');

    // Display error message if both fields are not filled
    if (!name || !email) {
        
        // Both are not filled
        if (!name && !email) {
            nameField.classList.add('error-input-line');
            emailField.classList.add('error-input-line');
        } else if (!name) {
            nameField.classList.add('error-input-line');
        } else if (!email) {
            emailField.classList.add('error-input-line');
        }
        
        errorMessage.textContent = 'Please fill out all fields';
        errorMessage.classList.add('show');

        // Remove errors when user starts typing
        removeErrorLine(nameField);
        removeErrorLine(emailField);

        return;
    }

    if(!isValidEmail(email)) {
        // Ask user to enter a valid email address
        const emailField = document.getElementById('email');
        const errorMessage = emailField.parentElement.querySelector('.error-message');
        emailField.classList.add('error-input-line');
        errorMessage.textContent = 'Please enter a valid email';
        errorMessage.classList.add('show');

        removeErrorLine(emailField);
        return;
    }

    console.log('Sign up attempt with name:', name);

    try {
        const response = await fetch('/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('member', JSON.stringify({name, email}));
            hideModal();
            showWelcomeMessage(name);
        } else {
            emailField.classList.add('error-input-line');
            errorMessage.textContent = 'Email is already registered';
            errorMessage.classList.add('show');
            removeErrorLine(emailField);
        }
    }
    catch (error) {
        console.log('Error', error);
    }
}

function removeErrorLine(inputElement) {
    inputElement.addEventListener('input', function() {
        this.classList.remove('error-input-line');
    });
}

function showModal() {
    const modal = document.querySelector('.modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function hideModal() {
    const modal = document.querySelector('.modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}