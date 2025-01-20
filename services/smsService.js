const axios = require('axios');
require('dotenv').config();

// mTalkz configuration using environment variables
const MTALKZ_CONFIG = {
  API_KEY: process.env.MTALKZ_API_KEY,
  SENDER_ID: process.env.MTALKZ_SENDER_ID,
  TEMPLATE_ID: process.env.MTALKZ_TEMPLATE_ID,
  BASE_URL: process.env.MTALKZ_BASE_URL || 'https://msgn.mtalkz.com/api'
};

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = ['MTALKZ_API_KEY', 'MTALKZ_SENDER_ID'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

const sendSMSOTP = async (phone, otp) => {
  try {
    validateConfig();

    // Remove any prefixes (+91, 91) and keep just the number
    const cleanPhone = phone.replace(/^\+?91/, '').replace(/\D/g, '');
    
    // Construct message with template
    const message = `Your Factorykaam verification code is : ${otp} This code will expire in 10 minutes.`;

    // Prepare the POST request body
    const requestBody = {
      apikey: MTALKZ_CONFIG.API_KEY,
      senderid: MTALKZ_CONFIG.SENDER_ID,
      number: cleanPhone,
      message: message,
      format: 'json'
    };

    // Add template ID if configured
    if (MTALKZ_CONFIG.TEMPLATE_ID) {
      requestBody.tempid = MTALKZ_CONFIG.TEMPLATE_ID;
    }

    // Make the POST request
    const response = await axios.post(MTALKZ_CONFIG.BASE_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Log the response status for debugging (avoid logging sensitive data)
    console.log('mTalkz API Status:', response.data.status);

    // Check if the message was sent successfully
    if (response.data && response.data.status === 'OK') {
      return { 
        success: true, 
        message: 'OTP sent successfully',
        data: response.data 
      };
    } else if (response.data && response.data.status === 'ERROR') {
      throw new Error(response.data.message || 'Failed to send message');
    } else {
      throw new Error('Unexpected response from mTalkz API');
    }

  } catch (error) {
    console.error('Failed to send SMS OTP:', error.message);
    return { 
      success: false, 
      message: 'Failed to send OTP', 
      error: error.message,
      details: error.response?.data
    };
  }
};

const sendBulkSMS = async (numbers, message, templateId = null) => {
  try {
    validateConfig();

    // Clean phone numbers to remove any prefixes
    const cleanNumbers = Array.isArray(numbers) 
      ? numbers.map(num => num.replace(/^\+?91/, '').replace(/\D/g, ''))
      : numbers.replace(/^\+?91/, '').replace(/\D/g, '');
    
    // Join multiple numbers with commas if an array is provided
    const phoneNumbers = Array.isArray(cleanNumbers) ? cleanNumbers.join(',') : cleanNumbers;
    
    const requestBody = {
      apikey: MTALKZ_CONFIG.API_KEY,
      senderid: MTALKZ_CONFIG.SENDER_ID,
      number: phoneNumbers,
      message: message,
      format: 'json'
    };

    // Add template ID if provided or configured
    const finalTemplateId = templateId || MTALKZ_CONFIG.TEMPLATE_ID;
    if (finalTemplateId) {
      requestBody.tempid = finalTemplateId;
    }

    const response = await axios.post(MTALKZ_CONFIG.BASE_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Bulk SMS Status:', response.data.status);

    if (response.data && response.data.status === 'OK') {
      return {
        success: true,
        message: 'SMS sent successfully',
        data: response.data
      };
    } else if (response.data && response.data.status === 'ERROR') {
      throw new Error(response.data.message || 'Failed to send message');
    } else {
      throw new Error('Unexpected response from mTalkz API');
    }

  } catch (error) {
    console.error('Failed to send bulk SMS:', error.message);
    return {
      success: false,
      message: 'Failed to send SMS',
      error: error.message,
      details: error.response?.data
    };
  }
};

module.exports = {
  sendSMSOTP,
  sendBulkSMS
};
