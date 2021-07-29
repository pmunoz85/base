const array_paginador = (pagina, ultima_pagina) => {
  let array_ultima_pagina = [];

  if (ultima_pagina < 12) {
    array_ultima_pagina = Array.from(
      { length: ultima_pagina },
      (_, i) => i + 1
    );
  } else {
    if (pagina < 6) {
      array_ultima_pagina = Array.from({ length: 10 }, (_, i) => {
        if (i < 7) return i + 1;
        else if (i === 7) return '...';
        else if (i === 8) return ultima_pagina - 1;
        else return ultima_pagina;
      });
    } else if (pagina > ultima_pagina - 5) {
      array_ultima_pagina = Array.from({ length: 10 }, (_, i) => {
        if (i < 2) return i + 1;
        else if (i === 2) return '...';
        else if (i === 3) return ultima_pagina - 6;
        else if (i === 4) return ultima_pagina - 5;
        else if (i === 5) return ultima_pagina - 4;
        else if (i === 6) return ultima_pagina - 3;
        else if (i === 7) return ultima_pagina - 2;
        else if (i === 8) return ultima_pagina - 1;
        else if (i === 9) return ultima_pagina;
      });
    } else {
      array_ultima_pagina = Array.from({ length: 11 }, (_, i) => {
        if (i < 2) return i + 1;
        else if (i === 2) return '...';
        else if (i === 3) return pagina - 2;
        else if (i === 4) return pagina - 1;
        else if (i === 5) return pagina;
        else if (i === 6) return pagina + 1;
        else if (i === 7) return pagina + 2;
        else if (i === 8) return '...';
        else if (i === 9) return ultima_pagina - 1;
        else if (i === 10) return ultima_pagina;
      });
    }
  }
  return array_ultima_pagina;
};

module.exports = array_paginador;
