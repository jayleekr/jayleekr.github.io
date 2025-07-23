// Newsletter subscription Netlify function
const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
    };
  }

  try {
    const { email, language = 'ko' } = JSON.parse(event.body);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: language === 'ko' 
            ? '유효한 이메일 주소를 입력해주세요.'
            : 'Please enter a valid email address.'
        })
      };
    }

    // For now, simulate successful subscription
    // TODO: Replace with actual ConvertKit API integration

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: language === 'ko'
          ? '성공적으로 구독되었습니다! 확인 이메일을 확인해주세요.'
          : 'Successfully subscribed! Please check your email for confirmation.',
        subscriber: { email, language }
      })
    };

  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error. Please try again later.'
      })
    };
  }
};

module.exports = { handler };