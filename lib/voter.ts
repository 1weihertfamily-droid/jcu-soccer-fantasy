export function getVoterId() { 
    if (typeof window === "undefined") return ""; 
    let voterId = localStorage.getItem("jcu-voter-id"); 
    if (!voterId) { 
        voterId = crypto.randomUUID(); 
        localStorage.setItem( 
            "jcu-voter-id",
             voterId 
            ); 
        } 
        return voterId; 
    }