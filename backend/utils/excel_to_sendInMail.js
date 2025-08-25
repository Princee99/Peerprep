const XLSX = require('xlsx');
const path = require('path');

// Function to read passwords from Excel file
function readPasswordsFromExcel(filePath) {
    try {
        // Read the Excel file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Get first sheet
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        // Create a map of email to password
        const passwordMap = {};
        
        data.forEach(row => {
            // Adjust these column names based on your Excel structure
            const email = row.email;
            const password = row.plain_password;
            
            if (email && password) {
                passwordMap[email.toLowerCase()] = password;
            }
        });
        
        console.log(`Loaded ${Object.keys(passwordMap).length} passwords from Excel`);
        return passwordMap;
        
    } catch (error) {
        console.error('Error reading Excel file:', error.message);
        return {};
    }
}

// Function to get password for specific email from Excel
function getPasswordFromExcel(email, excelFilePath) {
    const passwordMap = readPasswordsFromExcel(excelFilePath);
    return passwordMap[email.toLowerCase()] || null;
}
// Main function to get password for email
function getPasswordForEmail(email, excelFilePath = null, generateIfNotFound = true) {
    // Default Excel file path if not provided
    const defaultExcelPath = path.join(__dirname, '../data/user_passwords.xlsx');
    const filePath = excelFilePath || defaultExcelPath;
    
    // Try to get password from Excel
    const excelPassword = getPasswordFromExcel(email, filePath);
    
    if (excelPassword) {
        console.log(`Found password for ${email} in Excel file`);
        return {
            password: excelPassword,
            source: 'excel',
            found: true
        };
    }
    
    // // If not found and generation is allowed
    // if (generateIfNotFound) {
    //     const generatedPassword = generateRandomPassword(8);
    //     console.log(`Generated new password for ${email} (not found in Excel)`);
    //     return {
    //         password: generatedPassword,
    //         source: 'generated',
    //         found: false
    //     };
    // }
    
    // return {
    //     password: null,
    //     source: 'none',
    //     found: false
    // };
}

module.exports = {
    readPasswordsFromExcel,
    getPasswordFromExcel,
    getPasswordForEmail,
};