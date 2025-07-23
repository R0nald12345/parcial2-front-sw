import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { ShapeAttributes } from './ShapeAttributes';

export class FlutterExporter {
  constructor(projectName = 'flutter_design') {
    this.projectName = projectName;
    this.zip = new JSZip();
  }

  async exportToFlutter(shapes) {
    const screens = this.getScreensFromShapes(shapes);

    // Crear cada widget individual
    screens.forEach((screen, index) => {
      const widgetName = `Screen${index + 1}`;
      const dartCode = this.generateFlutterWidget(widgetName, screen.background, screen.children);
      this.zip.file(`lib/${widgetName}.dart`, dartCode);
    });

    // Crear main.dart
    const mainCode = this.generateMainDart(screens.length);
    this.zip.file('lib/main.dart', mainCode);

    // Crear pubspec.yaml mínimo
    this.zip.file('pubspec.yaml', this.generatePubspec());

    // Descargar ZIP
    const content = await this.zip.generateAsync({ type: 'blob' });
    saveAs(content, `${this.projectName}.zip`);
  }

  getScreensFromShapes(shapes) {
    // Si hay algún rectángulo grande, lo toma como fondo
    const backgrounds = shapes.filter(s =>
      s.type === 'rectangle' &&
      (s.width > 300 && s.height > 300) // Puedes ajustar el tamaño mínimo
    );
    const screens = [];

    if (backgrounds.length === 0) {
      // Si no hay fondo, exporta todo como una sola pantalla
      screens.push({
        background: { x: 0, y: 0, width: 375, height: 812, fill: "#F3F6FD" }, // Fondo por defecto
        children: shapes
      });
      return screens;
    }

    backgrounds.forEach(bg => {
      const children = shapes.filter(s => s.id !== bg.id &&
        s.x >= bg.x && s.x + s.width <= bg.x + bg.width &&
        s.y >= bg.y && s.y + s.height <= bg.y + bg.height
      ).map(child => ({
        ...child,
        x: child.x - bg.x,
        y: child.y - bg.y
      }));

      screens.push({
        background: bg,
        children
      });
    });

    return screens;
  }

  generateFlutterWidget(widgetName, bg, children) {
    let code = `
import 'package:flutter/material.dart';

class ${widgetName} extends StatelessWidget {
  const ${widgetName}({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.grey[300],
        child: Stack(
          children: [
`;

    children.forEach(shape => {
      code += this.generateFlutterWidgetChild(shape);
    });

    code += `
          ],
        ),
      ),
    );
  }
}
`;
    return code;
  }

  generateFlutterWidgetChild(shape) {
    const style = {
      width: shape.width,
      height: shape.height,
      left: shape.x,
      top: shape.y,
      color: shape.fill || '#ffffff',
      // CORREGIDO: border como argumento nombrado
      border: shape.strokeWidth > 0 ? `border: Border.all(color: Color(0xFF${shape.stroke?.replace('#', '') || '000000'}), width: ${shape.strokeWidth})` : null,
      rotation: shape.rotation
    };

    let widget = '';

    switch (shape.type) {
      case 'rectangle':
        widget = `
            Positioned(
              left: ${style.left},
              top: ${style.top},
              child: Transform.rotate(
                angle: ${style.rotation * Math.PI / 180},
                child: Container(
                  width: ${style.width},
                  height: ${style.height},
                  decoration: BoxDecoration(
                    color: Color(0xFF${style.color.replace('#', '')}),
                    ${style.border ? style.border + ',' : ''}
                  ),
                ),
              ),
            ),
`;
        break;

      case 'circle':
        widget = `
            Positioned(
              left: ${style.left},
              top: ${style.top},
              child: Container(
                width: ${style.width},
                height: ${style.height},
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFF${style.color.replace('#', '')}),
                  ${style.border ? style.border + ',' : ''}
                ),
              ),
            ),
`;
        break;

      case 'triangle':
        widget = `
            Positioned(
              left: ${style.left},
              top: ${style.top},
              child: CustomPaint(
                size: Size(${style.width}, ${style.height}),
                painter: TrianglePainter(Color(0xFF${style.color.replace('#', '')})),
              ),
            ),
`;
        break;

      case 'text':
        widget = `
            Positioned(
              left: ${style.left},
              top: ${style.top},
              child: Text(
                '${shape.text}',
                style: TextStyle(
                  color: Color(0xFF${style.color.replace('#', '')}),
                  fontSize: ${shape.fontSize || 16},
                  fontFamily: '${shape.fontFamily || 'Arial'}'
                ),
              ),
            ),
`;
        break;

      default:
        widget = '';
        break;
    }

    return widget;
  }

  generateMainDart(screenCount) {
    const imports = Array.from({ length: screenCount }, (_, i) => `import 'Screen${i + 1}.dart';`).join('\n');

    const routes = Array.from({ length: screenCount }, (_, i) =>
      `'screen${i + 1}': (context) => const Screen${i + 1}(),`
    ).join('\n      ');

    return `
import 'package:flutter/material.dart';
${imports}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Exported App',
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: 'screen1',
      routes: {
        ${routes}
      },
    );
  }
}
`;
  }

  generatePubspec() {
    return `
name: ${this.projectName}
description: Proyecto exportado desde graficadora
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=2.17.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true
`;
  }
}
