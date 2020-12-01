let clientX;
let clientY;
let mouse_down;
class picker{
	 hsv;
	 rgb;
	 width;
	 height;
	 canvas;
	 ctx;	
	 output;
	 hue_obj_cursor;
	 value_obj_cursor;
	 value_obj_black_cursor;
	constructor(){
	 	this.hsv = [0.0,1.0,1.0];
	 	this.rgb = [255.0,1.0,1.0];
	 	this.width = 768;
	 	this.height = 480;	
	 	this.output = document.querySelector('.color_picker_output'); 	
	 	this.hue_obj_cursor = document.querySelector('.cursor_hue_picker'); 	
	 	this.value_obj_cursor = document.querySelector('.color-picker-value-shape'); 	
	 	this.value_obj_black_cursor = document.querySelector('.color-picker-value-shape_black'); 	
	}
	initialize(div_to_append){
		this.canvas = document.createElement('canvas');
		this.canvas.className = "color_picker_wnd2";
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		div_to_append.appendChild(this.canvas);
		this.ctx = this.canvas.getContext('2d');	
	}
	render(){
		try	{
		this.ctx.clearRect(0,0,this.width,this.height);			
		let gradient = this.ctx.createLinearGradient(0,0,this.width,0);	
		let max_value_color = hsvToRgb(this.hsv[0], 1, 1);

		gradient.addColorStop(0, 'white');
		gradient.addColorStop(1.0, rgbToHex(max_value_color[0], max_value_color[1], max_value_color[2]));					
		this.ctx.fillStyle = gradient;
		this.ctx.fillRect(0,0,this.width,this.height);	
		this.output.style.background = rgbToHex(this.rgb[0], this.rgb[1], this.rgb[2]);
		this.hue_obj_cursor.style.left = Math.floor((this.hsv[0] * 100)) + "%";
		this.value_obj_cursor.style.left = Math.floor((this.hsv[1] * 100)) + "%";
		this.value_obj_cursor.style.top = Math.floor(((1-this.hsv[2]) * 100))*480/100 + "px";
		this.value_obj_black_cursor.style.left = Math.floor((this.hsv[1] * 100)) + "%";
		this.value_obj_black_cursor.style.top = Math.floor(((1-this.hsv[2]) * 100))*480/100 + "px";
		}
		catch(e){	
		console.log(e);	
		}			
	}		
}
class program{
	picker_obj;
	hue_button_picker_obj;
	constructor(){
		this.picker_obj = null;
		this.hue_button_picker_obj = null;
	}
	initialize(picker_obj, hue_btn_obj, div_for_color_picker){
		this.picker_obj = picker_obj;
		this.hue_button_picker_obj = hue_btn_obj;
		picker_obj.initialize(div_for_color_picker);
	}
	calculate_colors(){
		try{
			if(!mouse_down)return;
		this.hue_button_rect = this.hue_button_picker_obj.getBoundingClientRect();
		this.value_area = this.picker_obj.canvas.getBoundingClientRect();
		if(mouse_in_rect(this.hue_button_rect.left, this.hue_button_rect.top, this.hue_button_rect.right - this.hue_button_rect.left, this.hue_button_rect.bottom - this.hue_button_rect.top))
		{
			this.percent = ( clientX - this.hue_button_rect.left)/this.picker_obj.width;
			this.picker_obj.hsv[0] = this.percent;//hue	
		}	
		if(mouse_in_rect(this.value_area.left, this.value_area.top, this.value_area.right - this.value_area.left, this.value_area.bottom - this.value_area.top))
		{
			this.val = ( clientX - this.value_area.left)/this.picker_obj.width;
			this.picker_obj.hsv[1] = this.val;//satur	
			this.picker_obj.hsv[2] = 1-((clientY - this.value_area.top)/this.picker_obj.height);//val	
		}							
		this.picker_obj.rgb = hsvToRgb(this.picker_obj.hsv[0], this.picker_obj.hsv[1], this.picker_obj.hsv[2]);
		}
		catch(exc){
			console.log(exc);
		}
	}
}

let main_handle = ()=>{
	if(!this.program_obj){
	this.program_obj = new program();
	this.program_obj.initialize(new picker(), document.querySelector('.color_picker_hue'), document.querySelector('.color_picker_wnd'));
	}
	try{
		this.program_obj.calculate_colors();	
		this.program_obj.picker_obj.render();
	}
	catch(exception){console.log(exception);}
	this.shit = setTimeout(main_handle, 2);

}






window.addEventListener('DOMContentLoaded', ()=>{
	window.addEventListener('mousedown', (e)=>{
		mouse_down = true;
	});
	window.addEventListener('mouseup', (e)=>{
		mouse_down = false;
	});
	window.addEventListener('mousemove', (e)=>{
		clientX = e.clientX;
		clientY = e.clientY;
	});
	main_handle();

});

























let mouse_in_rect = (x1, y1, w1, h1)=>{
	if(clientX > x1 && clientX < x1 + w1)
	{
		if(clientY > y1 && clientY < y1 + h1)return true;
	}
	return false;
}










function rgbToHsv(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;

  let d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, v ];
}
function hsvToRgb(h, s, v) {
  let r, g, b;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [ Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255) ];
}
function rgbToHex(r, g, b) {
 return '#'+(0x1000000+(r<<16)+(g<<8)+b).toString(16).substring(1);
}