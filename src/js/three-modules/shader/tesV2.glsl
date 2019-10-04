mat2 rotate(float a) {
	float c = cos(a), s = sin(a);
	return mat2(c, s, -s, c);
}

float df(vec3 p)
{
	p *= mat3(cos(p.z), sin(p.z), 0.0, -sin(p.z), cos(p.z), 0.0, 0.0, 0.0, 1.0); //ねじり
	float s = 1.0, d = 0.0;
	for (int i = 0; i < 6; i++)
	{
		vec3 q = abs(mod(p*s + 1.0, 2.0) - 1.0) ;
		q = vec3(max(q.x, q.y), max(q.y, q.z), max(q.z, q.x));
		d = max(d, -(min(q.x, min(q.y, q.z)) - 0.5) / s);
		s *= 2.4;
	}
	return d;
}

//https://www.shadertoy.com/view/ll2GD3
vec3 pal(float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
	return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 p = (fragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);

	vec3 cPos = vec3(sin(iTime*0.1)*0.1,0, -iTime*0.1);
	vec3 dir = normalize(vec3(p.xy*2.0, -1));
	dir.xz *= rotate(cos(iTime*0.5)*0.2);
	float depth = 0.0, dist = 0.0;
	vec3 pos = vec3(0), col = vec3(0);
	for (int i=0; i<64; i++)
	{
		pos = cPos + dir * depth;
		dist = df(pos);
		if (dist < 0.0001 || pos.z > 50.0) break;
		col += exp(-dist*40.0) * pal(length(pos)*0.8, vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25) );
		depth += dist*0.2;
	}
	fragColor = vec4(col * 0.02, 1.0);
}