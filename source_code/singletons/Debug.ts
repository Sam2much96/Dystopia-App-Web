/**
 * Debug Class
 *  
 * For properly debugging elements in littlejs
 * by attaching debug variables to the ljs inengine debugger
 * 
 * Currently unimplemented
 * Would require refactoring each singleton to reference this class
 * would require syncing with mobile build syntax per object
 * Should replace console.log debugging
 * 
 */

class Debug {



}


export function logToScreen(...args: unknown[]): void {
    const debugEl = document.getElementById('debug');
    if (!debugEl) {
        console.warn('Debug element with id="debug" not found.');
        return;
    }

    const logLine = args
        .map(arg => {
            if (typeof arg === 'string') return arg;
            try {
                return JSON.stringify(arg);
            } catch {
                return String(arg);
            }
        })
        .join(' ');

    debugEl.innerHTML += logLine + '<br>';
    debugEl.scrollTop = debugEl.scrollHeight;
}