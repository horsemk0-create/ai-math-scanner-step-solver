export const handler = async (event: any, context: any) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: "ok",
      time: new Date().toISOString(),
      environment: "netlify-lambda",
    }),
  };
};
