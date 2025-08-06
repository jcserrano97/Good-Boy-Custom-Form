// Google Drive File Upload Service
class GoogleDriveService {
    constructor() {
        // Google API credentials
        this.API_KEY = 'AIzaSyCBgf84LzzY98X_VytGGdOgkc4szs9YbDs';
        this.CLIENT_ID = '1013149769084-imj8ugke5u0l12kr52eg23d0aveous6c.apps.googleusercontent.com';
        this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
        this.SCOPES = 'https://www.googleapis.com/auth/drive.file';
        
        // Your shared folder ID for Custom Order Uploads
        this.FOLDER_ID = '1dRhCPe6FGBGbOW0DR6YxsFyXdqMIF0pO';
        
        this.gapi = null;
        this.isInitialized = false;
    }
    
    async init() {
        try {
            console.log('Initializing Google Drive service...');
            
            // Load Google API
            if (typeof gapi === 'undefined') {
                await this.loadGoogleAPI();
            }
            
            // Initialize gapi
            await gapi.load('client:auth2', async () => {
                await gapi.client.init({
                    apiKey: this.API_KEY,
                    clientId: this.CLIENT_ID,
                    discoveryDocs: [this.DISCOVERY_DOC],
                    scope: this.SCOPES
                });
                
                this.isInitialized = true;
                console.log('Google Drive service initialized successfully');
            });
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Google Drive service:', error);
            return false;
        }
    }
    
    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (typeof gapi !== 'undefined') {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async authenticate() {
        try {
            const authInstance = gapi.auth2.getAuthInstance();
            
            if (authInstance.isSignedIn.get()) {
                console.log('Already authenticated with Google Drive');
                return true;
            }
            
            console.log('Requesting Google Drive authentication...');
            await authInstance.signIn();
            console.log('Google Drive authentication successful');
            return true;
        } catch (error) {
            console.error('Google Drive authentication failed:', error);
            return false;
        }
    }
    
    async uploadFile(file, customerName, eventName) {
        try {
            if (!this.isInitialized) {
                throw new Error('Google Drive service not initialized');
            }
            
            // Authenticate if needed
            const isAuthenticated = await this.authenticate();
            if (!isAuthenticated) {
                throw new Error('Authentication failed');
            }
            
            console.log('Uploading file to Google Drive:', file.name);
            
            // Generate a unique filename
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            const sanitizedCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '_');
            const sanitizedEventName = eventName.replace(/[^a-zA-Z0-9]/g, '_');
            const fileExtension = file.name.split('.').pop();
            const uniqueFileName = `${timestamp}_${sanitizedCustomerName}_${sanitizedEventName}_logo.${fileExtension}`;
            
            // Prepare file metadata
            const metadata = {
                name: uniqueFileName,
                parents: [this.FOLDER_ID],
                description: `Logo upload for ${customerName} - ${eventName} (${new Date().toLocaleDateString()})`
            };
            
            // Upload file using multipart upload
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            form.append('file', file);
            
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
                }),
                body: form
            });
            
            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('File uploaded successfully:', result);
            
            // Make file shareable (anyone with link can view)
            await this.shareFile(result.id);
            
            return {
                success: true,
                fileId: result.id,
                fileName: result.name,
                viewLink: result.webViewLink,
                downloadLink: result.webContentLink
            };
            
        } catch (error) {
            console.error('File upload to Google Drive failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async shareFile(fileId) {
        try {
            // Make the file shareable with anyone who has the link
            await gapi.client.drive.permissions.create({
                fileId: fileId,
                resource: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
            console.log('File sharing permissions set successfully');
        } catch (error) {
            console.warn('Failed to set sharing permissions:', error);
            // Don't throw error - file is still uploaded
        }
    }
    
    // Fallback: Create a simple shareable link without authentication
    async createShareableLink(file, customerName, eventName) {
        try {
            // This is a simplified approach that doesn't require authentication
            // It creates a temporary URL for the file that can be shared
            const fileURL = URL.createObjectURL(file);
            
            // Generate a description for the email
            const timestamp = new Date().toLocaleString();
            const fileInfo = {
                fileName: file.name,
                fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                fileType: file.type,
                uploadTime: timestamp,
                customerName: customerName,
                eventName: eventName,
                temporaryURL: fileURL // Note: This only works in the same session
            };
            
            return {
                success: true,
                fileInfo: fileInfo,
                note: 'File prepared for manual sharing'
            };
        } catch (error) {
            console.error('Fallback file handling failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Initialize the service
const googleDriveService = new GoogleDriveService();