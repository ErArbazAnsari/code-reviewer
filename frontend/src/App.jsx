import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import ReviewResults from "./components/ReviewResults";
import { ThemeProvider } from "./context/ThemeContext";

// Safely access environment variables with fallbacks
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/ai/get-review";

function App() {
    const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`);

    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [backendStatus, setBackendStatus] = useState({ checked: false, isOnline: false });

    // Check if backend is available on component mount
    useEffect(() => {
        const checkBackendStatus = async () => {
            try {
                // Extract the base URL from the API endpoint
                const baseUrl = API_URL.split('/ai/')[0];
                await axios.get(`${baseUrl}/`, { timeout: 3000 });
                setBackendStatus({ checked: true, isOnline: true });
            } catch (error) {
                console.warn("Backend may not be available:", error.message);
                setBackendStatus({ checked: true, isOnline: false });
            }
        };

        checkBackendStatus();
    }, []);

    async function reviewCode() {
        setIsLoading(true);
        setError(null);
        
        try {
            console.log("Sending request to:", API_URL);
            const response = await axios.post(API_URL, { code }, {
                timeout: 30000, // 30 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Check the response structure and set review accordingly
            if (response.data && response.data.response) {
                setReview(response.data.response);
            } else if (typeof response.data === 'string') {
                // If response is directly a string
                setReview(response.data);
            } else {
                console.error("Unexpected response format:", response.data);
                setError("Received an unexpected response format from the server.");
            }
        } catch (error) {
            console.error("Error reviewing code:", error);
            
            // Detailed error handling
            if (error.code === 'ECONNABORTED') {
                setError("Request timed out. The server might be busy or unavailable.");
            } else if (!error.response) {
                setError("Network error: Please check your connection and ensure the backend is running.");
            } else {
                setError(
                    error.response?.data?.error || 
                    `Error (${error.response?.status || 'unknown'}): ${error.message || 'Failed to get review'}`
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                
                <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col">
                    {backendStatus.checked && !backendStatus.isOnline && (
                        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 p-3 mb-4 rounded-md text-sm">
                            ⚠️ Backend server might not be available. Code review functionality may not work properly.
                        </div>
                    )}
                
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 mb-4 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 flex-1">
                        <div className="h-[500px] lg:h-auto">
                            <CodeEditor 
                                code={code} 
                                setCode={setCode} 
                                onReview={reviewCode} 
                                isLoading={isLoading}
                            />
                        </div>
                        
                        <div className="h-[500px] lg:h-auto">
                            <ReviewResults 
                                review={review} 
                                isLoading={isLoading} 
                            />
                        </div>
                    </div>
                </main>
                
                <footer className="border-t py-4 text-center text-sm text-muted-foreground">
                    <p>
                        Built with ❤️ by <a href="https://github.com/erarbazansari" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Arbaz Ansari</a>
                    </p>
                </footer>
            </div>
        </ThemeProvider>
    );
}

export default App;
