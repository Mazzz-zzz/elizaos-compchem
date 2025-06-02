import { Service, IAgentRuntime, ServiceType } from "../types/mock-eliza.js";
import { execFile } from "child_process";
import { promisify } from "util";
import * as path from "path";

const execFileAsync = promisify(execFile);

export interface GaussianParserService extends Service {
    parseGaussianFile(
        filePath: string,
        metadata?: Record<string, any>
    ): Promise<string>;
    
    validateGaussianFile(filePath: string): Promise<boolean>;
    
    getSupportedFormats(): string[];
}

class GaussianParserServiceImpl implements GaussianParserService {
    static serviceType: ServiceType = ServiceType.OTHER;

    async initialize(runtime: IAgentRuntime): Promise<void> {
        // Initialize the service
        console.log("Initializing Gaussian Parser Service");
        
        // Verify Python and required packages are available
        try {
            await execFileAsync("python", ["-c", "import cclib, rdflib, pydantic; print('Dependencies OK')"]);
            console.log("Python dependencies verified");
        } catch (error) {
            console.error("Python dependencies not available:", error);
            throw new Error("Required Python packages (cclib, rdflib, pydantic) are not installed");
        }
    }

    async parseGaussianFile(
        filePath: string,
        metadata: Record<string, any> = {}
    ): Promise<string> {
        try {
            const pythonScript = path.join(process.cwd(), "py", "parse_gaussian.py");
            
            const { stdout: rdfOutput } = await execFileAsync("python", [
                pythonScript,
                filePath,
                JSON.stringify(metadata),
                "--format", "turtle"
            ]);

            return rdfOutput;
        } catch (error) {
            console.error("Error parsing Gaussian file:", error);
            throw new Error(`Failed to parse Gaussian file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async validateGaussianFile(filePath: string): Promise<boolean> {
        try {
            // Basic validation - check if file contains Gaussian signatures
            const fs = await import("fs/promises");
            const content = await fs.readFile(filePath, 'utf-8');
            
            const gaussianSignatures = [
                'Entering Gaussian',
                'Gaussian 16',
                'Gaussian 09', 
                'Gaussian 03',
                '# ',  // Gaussian route section
                'SCF Done',
                'Normal termination'
            ];

            return gaussianSignatures.some(signature => content.includes(signature));
        } catch (error) {
            console.error("Error validating Gaussian file:", error);
            return false;
        }
    }

    getSupportedFormats(): string[] {
        return ['.log', '.out', '.fchk'];
    }

    // Required Service interface methods
    get serviceType(): ServiceType {
        return ServiceType.OTHER;
    }
}

export const gaussianParserService: Service = {
    serviceType: ServiceType.OTHER,
    initialize: async (runtime: IAgentRuntime) => {
        const service = new GaussianParserServiceImpl();
        await service.initialize(runtime);
        
        // Register the service with the runtime
        runtime.registerService("gaussianParser", service);
        
        console.log("Gaussian Parser Service registered successfully");
    },
}; 