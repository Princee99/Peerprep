// const bcrypt = require('bcryptjs');

// async function generateHash() {
//     const password = "@22Dce116";
//     const saltRounds = 10;
    
//     try {
//         const hash = await bcrypt.hash(password, saltRounds);
//         console.log('Password:', password);
//         console.log('Hashed password:', hash);
        
//         // Also verify the password
//         const isValid = await bcrypt.compare(password, hash);
//         console.log('Verification test:', isValid); // Should print true
        
//         // Print SQL command
//         console.log('\nSQL command to update user:');
//         console.log(`UPDATE users SET password='${hash}' WHERE email='22dce116@charusat.edu.in';`);
//     } catch (err) {
//         console.error('Error:', err);
//     }
// }
const bcrypt = require('bcryptjs');
const xlsx = require('xlsx');
const fs = require('fs');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get user input
function getUserInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function generatePasswordsFromExcel(filePath) {
    try {
        console.log(`🔄 Starting password generation from Excel file: ${filePath}\n`);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`❌ Error: File not found at path: ${filePath}`);
            return false;
        }
        
        // Read the Excel file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sheet to JSON
        const users = xlsx.utils.sheet_to_json(worksheet);
        
        console.log(`Found ${users.length} users in Excel file`);
        console.log('Generating passwords...\n');
        
        const saltRounds = 10;
        const processedUsers = [];
        
        // Process each user
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            
            // Get data from Excel (adjust column names if needed)
            const userId = user.user_id || user.User_ID || user.id || user.ID;
            const email = user.email || user.Email;
            const role = user.role || user.Role;
            
            if (!email) {
                console.log(`❌ Row ${i + 1}: Missing email, skipping...`);
                continue;
            }
            
            try {
                // Extract email prefix (part before @)
                const emailPrefix = email.split('@')[0];
                
                // Generate password based on pattern
                let password = generatePasswordFromEmail(emailPrefix);
                
                // Generate hash for the password
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                
                // Verify the hash works
                const isValid = await bcrypt.compare(password, hashedPassword);
                
                console.log(`✅ Row ${i + 1}:`);
                console.log(`   User ID: ${userId || 'N/A'}`);
                console.log(`   Email: ${email}`);
                console.log(`   Generated Password: ${password}`);
                console.log(`   Hashed Password: ${hashedPassword.substring(0, 25)}...`);
                console.log(`   Verification: ${isValid ? '✓ Valid' : '✗ Invalid'}`);
                console.log('   ---');
                
                // Store processed user data
                processedUsers.push({
                    user_id: userId,
                    email: email,
                    role: role,
                    plain_password: password,
                    hashed_password: hashedPassword
                });
                
            } catch (error) {
                console.error(`❌ Error processing user ${email}:`, error);
            }
        }
        
        // Get output directory from input file path
        const inputDir = filePath.substring(0, filePath.lastIndexOf('\\'));
        const outputDir = inputDir || './';
        
        // Create output Excel file with hashed passwords
        const outputWorkbook = xlsx.utils.book_new();
        const outputWorksheet = xlsx.utils.json_to_sheet(processedUsers);
        xlsx.utils.book_append_sheet(outputWorkbook, outputWorksheet, 'Users_With_Hashes');
        const outputFilePath = `${outputDir}\\users_with_hashed_passwords.xlsx`;
        xlsx.writeFile(outputWorkbook, outputFilePath);
        
        // Create summary report
        const summary = {
            input_file: filePath,
            total_users_in_excel: users.length,
            successfully_processed: processedUsers.length,
            failed_to_process: users.length - processedUsers.length,
            timestamp: new Date().toISOString(),
            password_pattern: "Email prefix with @ at beginning and first letter uppercase",
            output_files: {
                hashed_passwords_excel: outputFilePath,
                report_json: `${outputDir}\\password_generation_report.json`
            }
        };
        
        const reportFilePath = `${outputDir}\\password_generation_report.json`;
        fs.writeFileSync(reportFilePath, JSON.stringify(summary, null, 2));
        
        console.log(`\n📊 GENERATION COMPLETE!`);
        console.log(`   Input File: ${filePath}`);
        console.log(`   Total users in Excel: ${summary.total_users_in_excel}`);
        console.log(`   Successfully processed: ${summary.successfully_processed}`);
        console.log(`   Failed to process: ${summary.failed_to_process}`);
        console.log(`\n📁 Generated Files:`);
        console.log(`   ✓ ${outputFilePath}`);
        console.log(`   ✓ ${reportFilePath}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error reading Excel file:', error);
        console.log('\n💡 Make sure:');
        console.log('   1. The Excel file path is correct');
        console.log('   2. Excel file has columns: user_id, email, role');
        console.log('   3. Required dependencies are installed: npm install xlsx bcryptjs');
        return false;
    }
}

// Function to generate password from email prefix
function generatePasswordFromEmail(emailPrefix) {
    // Pattern: @EmailPrefix with first letter uppercase
    // Examples:
    // 22it117 → @22It117
    // d22ce089 → @D22ce089
    // john.doe → @John.doe
    
    if (!emailPrefix || emailPrefix.length === 0) {
        return '@Default123'; // Fallback
    }
    
    // Find first letter and make it uppercase, keep rest as is
    let password = '@';
    let firstLetterFound = false;
    
    for (let i = 0; i < emailPrefix.length; i++) {
        const char = emailPrefix[i];
        if (!firstLetterFound && /[a-zA-Z]/.test(char)) {
            // First letter found - make it uppercase
            password += char.toUpperCase();
            firstLetterFound = true;
        } else {
            // Keep all other characters as is
            password += char;
        }
    }
    
    return password;
}

// Main execution
async function main() {
    console.log('🔐 Password Generator for Excel Users\n');
    console.log('This tool will generate passwords based on email patterns');
    console.log('Pattern: email prefix with @ at beginning and first letter uppercase\n');
    
    const args = process.argv.slice(2);
    
    // Get Excel file path from user
    let filePath;
    
    if (args.length > 0) {
        // Use command line argument if provided
        filePath = args[0];
        console.log(`Using command line argument: ${filePath}\n`);
    } else {
        // Ask user for input
        filePath = await getUserInput('Enter the full path to your Excel file: ');
    }
    
    // Clean up the path (remove quotes if present)
    filePath = filePath.replace(/"/g, '').trim();
    
    if (!filePath) {
        console.log('❌ No file path provided!');
        console.log('\n💡 Usage example:');
        console.log('   node generate-password.js "D:\\path\\to\\your\\file.xlsx"');
        rl.close();
        return;
    }
    
    console.log(`📂 Processing file: ${filePath}`);
    
    const success = await generatePasswordsFromExcel(filePath);
    
    if (success) {
        console.log('\n🎉 Password generation completed successfully!');
    } else {
        console.log('\n❌ Password generation failed. Please check the error messages above.');
    }
    
    rl.close();
}

// Test the password generation function
function testPasswordGeneration() {
    console.log('🧪 Testing password generation patterns:');
    const testEmails = [
        "22it117@charusat.edu.in",
        "d22ce089@charusat.edu.in", 
        "22dce116@charusat.edu.in",
        "john.doe@example.com",
        "admin@charusat.edu.in",
        "123abc@example.com",
        "xyz456@domain.com"
    ];
    
    testEmails.forEach(email => {
        const prefix = email.split('@')[0];
        const password = generatePasswordFromEmail(prefix);
        console.log(`   ${email} → ${password}`);
    });
    console.log('');
}

// Run test if --test flag is provided
if (process.argv.includes('--test')) {
    testPasswordGeneration();
    process.exit(0);
} else {
    main();
}