/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package apache

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"

	"gopkg.in/yaml.v2"
)

type Info struct {
	SlugName string `yaml:"slug_name"`
	Type     string `yaml:"type"`
	Version  string `yaml:"version"`
	Author   string `yaml:"author"`
	Link     string `yaml:"link"`
}

func (c *Info) getInfo() *Info {
	_, filename, _, _ := runtime.Caller(0)
	wd := filepath.Dir(filename)

	yamlFilePath := filepath.Join(wd, "info.yaml")
	yamlFile, err := os.ReadFile(yamlFilePath)
	if err != nil {
		fmt.Println(err)
	}
	err = yaml.Unmarshal(yamlFile, c)
	if err != nil {
		fmt.Println(err)
	}
	return c
}
