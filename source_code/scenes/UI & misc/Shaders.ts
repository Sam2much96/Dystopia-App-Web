/**
 * 
 * All Shaders Used In this game
 * 
 */


  // to do:
    // (1) move shaders to external files and export them for more compact code
    export const televisionShader = `
    // Simple TV Shader Code
    float hash(vec2 p)
    {
        p=fract(p*.3197);
        return fract(1.+sin(51.*p.x+73.*p.y)*13753.3);
    }
    float noise(vec2 p)
    {
        vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+1.),u.x),u.y);
    }
    void mainImage(out vec4 c, vec2 p)
    {
        // put uv in texture pixel space
        p /= iResolution.xy;

        // apply fuzz as horizontal offset
        const float fuzz = .0005;
        const float fuzzScale = 800.;
        const float fuzzSpeed = 9.;
        p.x += fuzz*(noise(vec2(p.y*fuzzScale, iTime*fuzzSpeed))*2.-1.);

        // init output color
        c = texture(iChannel0, p);

        // chromatic aberration
        const float chromatic = .002;
        c.r = texture(iChannel0, p - vec2(chromatic,0)).r;
        c.b = texture(iChannel0, p + vec2(chromatic,0)).b;

        // tv static noise
        const float staticNoise = .1;
        c += staticNoise * hash(p + mod(iTime, 1e3));

        // scan lines
        const float scanlineScale = 1e3;
        const float scanlineAlpha = .1;
        c *= 1. + scanlineAlpha*sin(p.y*scanlineScale);

        // black vignette around edges
        const float vignette = 2.;
        const float vignettePow = 6.;
        float dx = 2.*p.x-1., dy = 2.*p.y-1.;
        c *= 1.-pow((dx*dx + dy*dy)/vignette, vignettePow);
    }`;

   export const ImpactShader = `
void mainImage(out vec4 c, vec2 p)
{
    // normalize coordinates
    vec2 uv = (p - iResolution.xy * .5) / iResolution.y;
    
    // get distance and angle from center
    float distance = length(uv);
    float angle = atan(uv.y, uv.x);
    
    // color based on angle and distance
    c.rgb = vec3(
        .5 + .5 * sin(angle + iTime),
        .5 + .5 * sin(angle + iTime * 2.),
        .5 + .5 * sin(distance * 5. - iTime)
    );
    
    // apply glow in center
    c += .1 / (distance + .1);

    // apply sine wave brightness
    c *= .5 + .5 * sin(distance * 20. - iTime * 3.);
}
`;
