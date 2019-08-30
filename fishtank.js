function rm_fish(n) {
    BODY.removeChild(FISH[n].s);
    delete FISH[n];
}

function catch_fish() {
    var max_x = window.innerWidth;
    var max_y = window.innerHeight;
    var rm_list = [];
    for (n in FISH) {
        var f = FISH[n];
        if (f.vx > 0) {
            if (f.x > max_x) {
                rm_list.push(n);
                continue;
            }
        }
        else {
            if (f.x + f.width < 0) {
                rm_list.push(n);
                continue;
            }
        }
        if ((f.y > max_y) && (f.vy > 0)) {
            rm_list.push(n);
            continue;
        }
        if ((f.y + f.height < 0) && (f.vy < 0)) {
            rm_list.push(n);
        }
    }
    for (let i = 0; i < rm_list.length; i++) {
        rm_fish(rm_list[i]);
    }
}

function normal(mean,std,steps) {
    var v = 0.0;
    for (let i = 0; i < steps; i++) {
        v += Math.random();
    }
    v -= 0.5 * steps;
    v /= Math.sqrt(steps / 12);
    v *= std;
    v += mean;
    return v;
}

function get_fish_density() {
    var d = window.innerWidth * window.innerHeight;
    var n = 0;
    for (f in FISH) {
        n += FISH[f].width * FISH[f].height;
    }
    return n / d;
}

function fish_html() {
    var color = Math.floor(Math.random() * 360);
    var tail_color = color + normal(0,30,10);
    var lip_color = (color + 60) % 360;
    color = "hsl(" + color + ", 100%, 50%)";
    tail_color = "hsl(" + tail_color + ", 100%, 50%)";
    if (lip_color < 120) {lip_color = "black"}
    else {lip_color = "red"};
    var s = 0.5 * Math.pow(4.0 , Math.random());
    var output = "<svg width=\""+100*s+"\" height=\""+62*s+"\">";
    output += "<circle cx=\""+69*s+"\" cy=\""+31*s+"\" r=\""+30*s+"\" fill=\""+color+"\" stroke=\"black\" stroke-width=\""+2*s+"\"/>";
    output += "<polygon points=\""+38*s+","+31*s+" "+s+","+s+" "+s+","+61*s+"\" fill=\""+tail_color+"\" stroke=\"black\" stroke-width=\""+2*s+"\"/>";
    output += "<circle cx=\""+79*s+"\" cy=\""+21*s+"\" r=\""+10*s+"\" fill=\"white\" stroke=\"black\" stroke-width=\""+2*s+"\"/>";
    output += "<circle cx=\""+82*s+"\" cy=\""+21*s+"\" r=\""+5*s+"\" fill=\"black\"/>";
    output += "<path d=\"M "+88*s+" "+50*s+" A "+20*s+" "+20*s+" 0 0 1 "+64*s+" "+41*s+"\" fill-opacity=\"0\" stroke=\""+lip_color+"\" stroke-width=\""+3*s+"\"/>";
    output += "</svg>";
    return [output,100*s,62*s];
}

function make_fish() {
    var n;
    while (true) {
        n = Math.floor(Math.random()*1e9);
        if (!(n in FISH)) {break;}
    }
    var f = {};
    FISH[n] = f;
    f.s = document.createElement("span");
    f.s.style.position = "fixed";
    BODY.appendChild(f.s);
    var fh = fish_html();
    f.s.innerHTML = fh[0];
    f.width = fh[1];
    f.height = fh[2];
    f.x = -f.width;
    f.y = Math.random() * (window.innerHeight * 2);
    f.y -= 0.5 * (window.innerHeight + f.height);
    f.vx = -1.0;
    while (f.vx < 0.2) {
        f.vx = normal(0.6,0.4,10);
    }
    f.vy = f.vx * normal(0,0.1,10);
    if (Math.random() < 0.5) {
        f.s.classList.add("back");
        f.vx *= -1;
        f.x = window.innerWidth;
    }
}

function move_fish() {
    for (n in FISH) {
        var f = FISH[n];
        f.x += f.vx;
        f.y += f.vy;
        f.s.style.left = f.x + "px";
        f.s.style.top = f.y + "px";
    }
}

function mayhem() {
    var n = Object.keys(FISH);
    if (n.length < 1) {
        return;
    }
    n = n[Math.floor(Math.random()*n.length)];
    var f = FISH[n];
    if (Math.random() < 0.5) {
        if (f.vx < 0) {
            f.s.classList.remove("back");
        }
        else {
            f.s.classList.add("back");
        }
        f.vx *= -1;
    }
    else {
        var vx = -1.0;
        while (vx < 0.2) {
            vx = normal(0.6,0.4,10);
        }
        var vy = vx * normal(0,0.1,10);
        if (vx * f.vx < 0) {
            vx *= -1;
        }
        f.vx = vx;
        f.vy = vy;
    }
}

function fish_loop() {
    catch_fish();
    while (get_fish_density() < 0.2) {
        make_fish();
    }
    move_fish();
    if (Math.random() < 0.01 * (Object.keys(FISH).length/36)) {
        mayhem();
    }
}

function load_background() {
    var s = Math.min(screen.width,screen.height);
    var b = document.getElementById("b");
    if (s <= 640) {
        b.src = "back_small.jpg";
        return;
    }
    if (s <= 1280) {
        b.src = "back_med.jpg";
        return;
    }
    if (s <= 1920) {
        b.src = "back_big.jpg";
        return;
    }
    b.src = "back_huge.jpg";
}

function set_backgorund_size() {
    var b = document.getElementById("b");
    if (b.width < screen.width + 20) {
        b.width = screen.width + 20;
    }
    if (b.height < screen.height + 20) {
        screen.height + 20;
    }
}

function draw_foreground() {
    var w = document.getElementById("w");
    var x = screen.width + 20;
    var y = screen.height + 20;
    var s = "<svg width=\""+x+"\" height=\""+y+"\">";
    s += "<rect width=\""+x+"\" height=\""+y+"\" style=\"fill:rgb(0,0,255)\"/>"
    s += "</svg>";
    w.innerHTML = s;
}

function launch() {
    BODY = document.getElementsByTagName("body")[0];
    FISH = {};
    load_background();
    set_backgorund_size();
    draw_foreground();
    setInterval(fish_loop,1000/60);
}
