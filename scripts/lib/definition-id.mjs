import ts from 'typescript';
/** Find a top-level content definition, without matching ids inside comments/code/exercises. */
export function definitionId(source,filename='content.ts'){
 const file=ts.createSourceFile(filename,source,ts.ScriptTarget.Latest,true);
 const ids=[];
 for(const statement of file.statements){if(!ts.isVariableStatement(statement))continue;for(const declaration of statement.declarationList.declarations){const object=declaration.initializer;if(!object||!ts.isObjectLiteralExpression(object))continue;for(const property of object.properties){if(!ts.isPropertyAssignment(property))continue;const name=ts.isIdentifier(property.name)||ts.isStringLiteral(property.name)?property.name.text:null;if(name==='id'&&ts.isStringLiteral(property.initializer))ids.push(property.initializer.text);}}}
 if(ids.length>1)throw Error('More than one content definition in '+filename);
 return ids[0];
}
