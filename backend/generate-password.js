const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = "@22Dce116";
    const saltRounds = 10;
    
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Password:', password);
        console.log('Hashed password:', hash);
        
        // Also verify the password
        const isValid = await bcrypt.compare(password, hash);
        console.log('Verification test:', isValid); // Should print true
        
        // Print SQL command
        console.log('\nSQL command to update user:');
        console.log(`UPDATE users SET password='${hash}' WHERE email='22dce116@charusat.edu.in';`);
    } catch (err) {
        console.error('Error:', err);
    }
}

generateHash();
