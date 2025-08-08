const fetch = require('node-fetch');

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const htmlContent = body.html;

    if (!htmlContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'HTML content is required' }),
      };
    }

    const apiKey = process.env.PDFSHIFT_API_KEY;

    const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: htmlContent, // This can be raw HTML or a URL
        landscape: false,
        use_print: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PDFShift error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'PDFShift conversion failed', details: errorText }),
      };
    }

    const pdfBuffer = await response.buffer();
    const base64Pdf = pdfBuffer.toString('base64');

    return {
      statusCode: 200,
      body: JSON.stringify({ pdf: `data:application/pdf;base64,${base64Pdf}` }),
    };
  } catch (error) {
    console.error('PDF generation failed:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate PDF' }),
    };
  }
};

/*
Content-Type: application/pdf
Content-Disposition: inline; filename="document.pdf"
Content-Disposition: attachment; filename="document.pdf"
*/
