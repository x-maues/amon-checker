import { measure } from './lib/measure.js';
import { submit } from './lib/submit-measurement.js'; 
import { pickRandomItem } from './lib/random.js';
import { MEASUREMENT_DELAY, UPDATE_NODES_DELAY, MIN_PROVIDERS_REQUIRED } from './lib/constants.js';
import { AkashClient } from './lib/akash-client.js';
import { colorize } from './lib/colors.js';


const client = new AkashClient();
let providers = []; 

try {
    console.log("\nFetching provider list...");
    providers = await client.getProviders();
    if (providers.length < MIN_PROVIDERS_REQUIRED) {
        console.warn(`Warning: Initially found only ${providers.length} providers (minimum ${MIN_PROVIDERS_REQUIRED} required)`);
    }
} catch (err) {
    console.error("FATAL: Failed to fetch initial provider list. Exiting.", err);
    process.exit(1); 
}


// --- Background task to update providers periodically ---

const updateProviders = async () => {
    try {
        console.log('Background task: Updating providers...');
        
        const updatedProviders = await client.getProviders(); 
        console.log(`Background update: Found ${updatedProviders.length} providers.`);
        if (updatedProviders.length < MIN_PROVIDERS_REQUIRED) {
            console.warn(`Warning: Update found only ${updatedProviders.length} providers (minimum ${MIN_PROVIDERS_REQUIRED} required)`);
        }
        // Atomically update the list
        providers = updatedProviders; 
    } catch (err) {
        console.error('Error during background provider update:', err);
    }
};

// Start background update loop
(async () => {
    while (true) {
        await new Promise(resolve => setTimeout(resolve, UPDATE_NODES_DELAY));
        await updateProviders();
    }
})(); // Self-invoking async function


// --- Main checking loop ---
console.log("\nStarting main checking loop...");
while (true) {
    let provider = null; 
    let jobAttempted = false; // Flag to track measurement was tried

    try {
        const currentProviderList = providers; 
        if (currentProviderList.length > 0) {
            jobAttempted = true; 

            // --- Select specific provider ---
            provider = pickRandomItem(currentProviderList); // Randomly pick a provider
            //provider = currentProviderList.find(p => p.id === 'akash13pc7m4em0sxye3uez3y0dzfp337w3u2s3xlks6');

            // --- Check if provider exists ---
            if (!provider) {
                console.warn("Specified provider not found in current list, skipping measurement.");
                // Don't mark job as completed if provider is not found
                jobAttempted = false; 
                continue; 
            }
            // --- End Check ---

            console.log(`\nRandomly picked provider: ${colorize.y(provider.id)}`); // Safe now
            // console.log("Provider details: ", provider); 

            // --- Perform measurement (gets simplified object) ---
            const measurement = await measure(provider); // Should return { retrievalSucceeded: boolean }
            console.log(`\nMeasurement result for ${colorize.y(provider.id)}:`, measurement); 

       
            // submit function should handle its own internal errors ideally
            await submit(measurement); 
            console.log(colorize.success(`Submission attempt completed for provider ${provider.id}.`))


        } else {
            console.log('No providers available in current list to check. Waiting...');
            // No job was attempted, wait longer before next check
            await new Promise(resolve => setTimeout(resolve, Math.max(MEASUREMENT_DELAY, 30000)));
            continue; 
        }
    } catch (err) {
        
        console.error(`Error during check loop (Provider attempted: ${provider?.id || 'N/A'})`); 
        console.error('Caught Error in main loop:', err); 

    }

    if (jobAttempted) {
        try {
             if (typeof Zinnia !== 'undefined' && Zinnia.jobCompleted) {
                 Zinnia.jobCompleted();
             } else {
                 console.warn("Zinnia or Zinnia.jobCompleted not found globally.");
             }
        } catch (zinniaError) {
             console.error("Error calling Zinnia.jobCompleted():", zinniaError);
        }
    }

    console.log(`Waiting ${MEASUREMENT_DELAY / 1_000} seconds before next check...`);
    await new Promise(resolve => setTimeout(resolve, MEASUREMENT_DELAY));
}